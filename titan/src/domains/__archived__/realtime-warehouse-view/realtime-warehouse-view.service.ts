import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { RealtimeWarehouseViewRepository } from './repositories/realtime-warehouse-view.repository';
import { CreateRealtimeWarehouseViewDto } from './dto/request/create-realtime-warehouse-view.dto';
import { FilteringRealtimeWarehouseViewDto } from './dto/request/filtering-realtime-warehouse-view.dto';
import { ResponseStatusDto } from 'src/common/dto/response-status.dto';
import { RealtimeWarehouseViewResponseDto } from './dto/response/realtime-warehouse-view-response.dto';
import { UpdateRealtimeWarehouseViewDto } from './dto/request/update-realtime-warehouse-view.dto';
import { plainToInstance } from 'class-transformer';
import { SseService } from 'src/core/sse/sse.service';
import { WarehouseService } from 'src/domains/storage/warehouse/warehouse.service';
import { DEBUG_VIEW_TABLE_SEARCH } from 'src/config/debug.config';

@Injectable()
export class RealtimeWarehouseViewService {
  private readonly logger = new Logger(RealtimeWarehouseViewService.name)
  private isRunning = false;
  constructor(
    private readonly repository: RealtimeWarehouseViewRepository,
    private readonly sseService: SseService,
    private readonly warehouseService: WarehouseService
  ) {}

  onModuleInit() {
    if (!DEBUG_VIEW_TABLE_SEARCH) {
      //this.scheduleTask();
    }
  }
  

  async createRealtimeWarehouseView(dto: CreateRealtimeWarehouseViewDto) : Promise<RealtimeWarehouseViewResponseDto> {
    const warehouse = await this.warehouseService.getWarehouseById(dto.warehouse_id);
    const rawResult = await this.repository.createRealtimeWarehouseView(warehouse, dto);
    const result = plainToInstance(RealtimeWarehouseViewResponseDto, rawResult, { excludeExtraneousValues: true });
    return result;
  };

  async updateRealtimeWarehouseView(viewId: number, dto: UpdateRealtimeWarehouseViewDto): Promise<ResponseStatusDto> {
    const filterDto = new FilteringRealtimeWarehouseViewDto();
    filterDto.id = viewId;
    const rwView = await this.repository.getFilteredOne({filter: filterDto});
    if (!rwView) {
      this.logger.warn(`Realtime Warehouse View not found : ${viewId}`);
      throw new NotFoundException(`Reawltime Warehouse View not found : ${viewId}`);
    }

    const warehouse = dto.warehouse_id ? await this.warehouseService.getWarehouseById(dto.warehouse_id) : rwView.warehouse;
    const result = await this.repository.updateRealtimeWarehouseView(rwView, warehouse, dto);
    let resStatusDto = new ResponseStatusDto();
    resStatusDto.isSuccess = result;
    resStatusDto.message = result ? 'RealtimeWarehouse updated successfully.' : 'Failed to update RealtimeWarehouse.';
    return resStatusDto;
  }

  async getRealtimeWarehouseViewList(filterDto: FilteringRealtimeWarehouseViewDto = new FilteringRealtimeWarehouseViewDto()): Promise<RealtimeWarehouseViewResponseDto[]> {
    const realtimeWarehouseViewList = await this.repository.getFilteredList({filter: filterDto});
    const result = plainToInstance(RealtimeWarehouseViewResponseDto, realtimeWarehouseViewList, { excludeExtraneousValues: true });
    return result;
  }

  async getRealtimeWarehouseViewById(realtimeWarehouseViewId: number): Promise<RealtimeWarehouseViewResponseDto> {
    const filterDto = new FilteringRealtimeWarehouseViewDto();
    filterDto.id = realtimeWarehouseViewId;
    const rwView = await this.repository.getFilteredOne({filter: filterDto});
    if (!rwView) {
      this.logger.warn(`RealtimeWarehouseView not found : ${realtimeWarehouseViewId}`);
      throw new NotFoundException(`RealtimeWarehouseView not found : ${realtimeWarehouseViewId}`);
    }
    const result = plainToInstance(RealtimeWarehouseViewResponseDto, rwView, { excludeExtraneousValues: true });
    return result;
  }

  // private async scheduleTask() {
  //   if (this.isRunning) {
  //     this.logger.warn('Previous RealtimeWarehouseViewService task is still running. Skipping...');
  //     return;
  //   }
  //   this.isRunning = true;

  //   try {
  //     const result = await this.getRealtimeWarehouseViewList();
  //     this.sseService.sendEventToAll('realtimeWarehouseView', result);
  //   } catch (error) {
  //     this.logger.error('Error in RealtimeWarehouseViewService scheduled task', error.message);
  //   } finally {
  //     this.isRunning = false;
  //   }
  //   setTimeout(() => this.scheduleTask(), 1000);
  // }
};