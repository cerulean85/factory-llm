import { Logger, Injectable, NotFoundException } from '@nestjs/common';
import { JobHistoryRepository } from './repositories/job-history.repository';
import { JobHistory } from './entities/job-history.entity';
import { FilteringJobHistoryDto } from './dto/request/filtering-job-history.dto';
import { CreateJobHistoryDto } from './dto/request/create-job-history.dto';
import { PalletService } from '../pallet/pallet.service';
import { EquipmentService } from 'src/domains/equipment/equipment/equipment.service';
import { UpdateJobHistoryDto } from './dto/request/update-job-history.dto';
import { WORKING_STATUS } from 'src/common/enum/equipment.enum';
import { WarehouseService } from '../warehouse/warehouse.service';
import { JobQueue } from 'src/collector-interface/queue/job-queue/entities/job-queue.entity';

@Injectable()
export class JobHistoryService {
  private readonly logger = new Logger(JobHistoryService.name)

  constructor(
    private readonly jobHistoryRepository: JobHistoryRepository,
    private readonly palletService: PalletService,
    private readonly warehouseService: WarehouseService,
  ) {}

  //취소 건을 마이너스한 complete JobHistory를 구한다.
  getStackedCompleteEntities(jobHistoryList: JobHistory[]) : JobHistory[]{
    const workingComplete = jobHistoryList.filter(x => x.working_status === WORKING_STATUS.COMPLETE);
    const workingCancel = jobHistoryList.filter(x => x.working_status === WORKING_STATUS.CANCEL);

    // 1) 취소 건들을 order_number+order_flow 기준으로 합산
    const cancelMap = new Map<string, number>();
    for (const item of workingCancel) {
      const key = `${item.order_number}__${item.order_flow}`;
      cancelMap.set(key, (cancelMap.get(key) ?? 0) + (item.st_count ?? 0));
    }

    // 2) 완료 건에서 차감
    for (const completeItem of workingComplete) {
      const key = `${completeItem.order_number}__${completeItem.order_flow}`;
      const cancelCount = cancelMap.get(key);
      if (cancelCount) {
        completeItem.st_count -= cancelCount;
        if (completeItem.st_count < 0) completeItem.st_count = 0; // 음수 방지
      }
    }

    return workingComplete;
  }

  async getJobHistoryEntities(filter : FilteringJobHistoryDto = new FilteringJobHistoryDto()): Promise<JobHistory[]> {
    const result = await this.jobHistoryRepository.getFilteredList({ filter: filter });
    if (!result) {
      this.logger.warn(`JobHistory not found`);
      throw new NotFoundException(`JobHistory not found`);
    }
    return result;
  }

  async getJobHistoryById(jobHistoryId: number): Promise<JobHistory> {
    const filterDto = new FilteringJobHistoryDto();
    filterDto.jobHistoryId = jobHistoryId;
    const result = await this.jobHistoryRepository.getFilteredOne({ filter: filterDto });
    if (!result) {
      this.logger.warn(`JobHistory with ID ${jobHistoryId} not found`);
      throw new NotFoundException(`JobHistory with ID ${jobHistoryId} not found`);
    }
    return result;
  }

  async createJobHistory(createDto: CreateJobHistoryDto): Promise<JobHistory>{
    const pallet = await this.palletService.getPalletEntityById(createDto.pallet_id);
    if (!pallet) {
      this.logger.warn(`Pallet with ID ${createDto.pallet_id} not found`);
      throw new NotFoundException(`Pallet with ID ${createDto.pallet_id} not found`);
    }
    const warehouse = await this.warehouseService.getWarehouseById(createDto.warehouse_id);
    if (!warehouse) {
      this.logger.warn(`Warehouse with ID ${createDto.warehouse_id} not found`);
      throw new NotFoundException(`Warehouse with ID ${createDto.warehouse_id} not found`);
    }

    const result = await this.jobHistoryRepository.createJobHistory(pallet, warehouse, createDto);
    return result;
  }

  async bulkInsertJobHistory(jobHistoryEntities: JobHistory[]): Promise<JobHistory[]>{
    try{
      return await this.jobHistoryRepository.bulkInsertJobHistory(jobHistoryEntities);
    } catch(error){
      this.logger.fatal('Failed to bulk insert JobHistory entities',error);
      throw error;
    }
  }

  async insertJobHistory(jobHistory: JobHistory): Promise<JobHistory> {
    return await this.jobHistoryRepository.insertJobHistory(jobHistory);
  }

  async updateJobHistory(jobHistoryId: number, updateDto: UpdateJobHistoryDto): Promise<boolean> {
    const filterDto = new FilteringJobHistoryDto();
    filterDto.jobHistoryId = jobHistoryId;
    const jobHistory = await this.jobHistoryRepository.getFilteredOne({ filter: filterDto });
    if (!jobHistory) {
      this.logger.warn(`JobHistory with ID ${jobHistoryId} not found`);
      throw new NotFoundException(`JobHistory with ID ${jobHistoryId} not found`);
    }
    const result = await this.jobHistoryRepository.updateJobHistory(jobHistory, updateDto);
 
    return result;
  }
}