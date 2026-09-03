import { Logger, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Transactional } from 'typeorm-transactional';
import { SseService } from 'src/core/sse/sse.service';
import { DEBUG_QUEUE_TABLE_SEARCH } from 'src/config/debug.config';
import { JobQueueRepository } from './repositories/job-queue.repository';
import { ORDER } from 'src/common/enum/db.enum';
import { JobHistoryResponseDto } from 'src/domains/storage/job-history/dto/response/job-history-response.dto';
import { JobQueueOrderKey } from './repositories/job-queue.base.repository';
import { JobHistoryService } from 'src/domains/storage/job-history/job-history.service';
import { TASK_TYPE, WORKING_STATUS } from 'src/common/enum/equipment.enum';
import { strToEnum } from 'src/utils/data-transform.util';
import { JobHistory } from 'src/domains/storage/job-history/entities/job-history.entity';
import { JobQueue } from './entities/job-queue.entity';
import { plainToInstance } from 'class-transformer';
import { arrayToJsonFile } from 'src/utils/json.util';



@Injectable()
export class JobQueueService {
    private readonly logger = new Logger(JobQueueService.name)
    private isRunning = false;
    constructor(
    private readonly jobQueueRepository: JobQueueRepository,
    private readonly jobHistoryService: JobHistoryService,
    private readonly sseService: SseService,
  ) { }



  onModuleInit() {
    if(DEBUG_QUEUE_TABLE_SEARCH){
      this.scheduleTask();
    }
  }

  private async scheduleTask() {
    if (this.isRunning) {
      this.logger.warn('Previous transferJobQueue still running, skipping...');
      return;
    }

    this.isRunning = true;

    try {
      const jobHistoryList = await this.popJobQueue();
      if (jobHistoryList && jobHistoryList.length > 0) {
        //this.sseService.sendEventToAll('jobTrigger', jobHistoryList);
        //this.logger.debug(`Sent ${jobHistoryList.length} job history via SSE`);
      } else {
      }
    } catch (err) {
      this.logger.error('Error during job transfer:', err.message);
    } finally {
      this.isRunning = false;
    }
    setTimeout(() => this.scheduleTask(), 1000);
  }


  private async popJobQueue() : Promise<JobHistoryResponseDto[]> {

    const jobQueueList = await this.jobQueueRepository.getFilteredList({ orderMap: { [JobQueueOrderKey.ID]: ORDER.ASC } });

    if (!jobQueueList?.length) {
      return [];
    }

    const jobHistoryList = [] as JobHistory[];
    const errorList = [] as JobQueue[];

    for (const queue of jobQueueList) {
      try {
        const newJobHistory = await this.insertHistoryAndDeleteQueue(queue);
        jobHistoryList.push(newJobHistory);
      } catch (error) {
        errorList.push(queue);
        const isDeleted = await this.jobQueueRepository.deleteJobQueue(queue.id);
        if (!isDeleted) {
          this.logger.warn(`Failed to delete JobQueue`);
          throw new InternalServerErrorException(`Failed to delete JobQueue`);
        }
      }
    }

    if (errorList && errorList.length > 0) {
      await arrayToJsonFile(JobQueueService.name, errorList)
    }
    return plainToInstance(JobHistoryResponseDto, jobHistoryList, {excludeExtraneousValues: true});
  };

  private mapToJobHistoryEntity(queue: JobQueue): JobHistory {
    const entity = new JobHistory();
    entity.warehouse      = queue.warehouse;
    entity.pallet         = queue.pallet;
    entity.working_status = strToEnum(queue.working_status, WORKING_STATUS, WORKING_STATUS.COMPLETE);
    entity.sku_key        = queue.item_master_view?.sku_key ?? '';
    entity.standard_type  = queue.item_master_view?.standard_type ?? '';
    entity.st_count       = queue.st_count ?? 0;
    entity.loc_raw        = queue.loc_raw ?? '';
    entity.task_type      = queue.task_type ? this.mapToTaskType(queue.task_type) : TASK_TYPE.NONE;
    entity.batch_number   = queue.batch_number ?? '';
    entity.order_number   = queue.order_number ?? '';
    entity.order_flow     = queue.order_flow ?? '';
    entity.job_date       = queue.job_date;

    return entity;
  }

  private mapToTaskType(taskTypeRaw: string) : TASK_TYPE{
    switch(taskTypeRaw){
      case "1":
        return TASK_TYPE.INPUT;
      case "2":
        return TASK_TYPE.OUTPUT;
      case "6":
        return TASK_TYPE.MOVE;
      default:
        return TASK_TYPE.NONE;
    }
  }

  @Transactional()
  private async insertHistoryAndDeleteQueue(queue: JobQueue): Promise<JobHistory> {
    const entity = this.mapToJobHistoryEntity(queue);
    const newJobHistory = await this.jobHistoryService.insertJobHistory(entity);
    const isDeleted = await this.jobQueueRepository.deleteJobQueue(queue.id);
    if (!isDeleted) {
      this.logger.warn(`Failed to delete JobQueue`);
      throw new InternalServerErrorException(`Failed to delete JobQueue`);
    }
    return newJobHistory;
  }
};