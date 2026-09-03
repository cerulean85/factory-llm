import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SseModule } from 'src/core/sse/sse.module';
import { JobQueue } from './entities/job-queue.entity';
import { JobQueueRepository } from './repositories/job-queue.repository';
import { Pagination } from 'src/utils/pagination.util';
import { JobQueueService } from './job-queue.service';
import { JobHistoryModule } from 'src/domains/storage/job-history/job-history.module';
import { ItemMasterViewModule } from 'src/collector-interface/view/item-master-view/item-master-view.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([JobQueue]),
    JobHistoryModule,
    SseModule,
    ItemMasterViewModule,
  ],
  providers: [ JobQueueService, JobQueueRepository, Pagination],
  exports: [ JobQueueService ]
})
export class JobQueueModule {}