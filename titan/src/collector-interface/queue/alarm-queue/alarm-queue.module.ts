import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlarmQueue } from './entities/alarm-queue.entity';
import { AlarmQueueRepository } from './repositories/alarm-queue.repository';
import { AlarmQueueService } from './alarm-queue.service';
import { SseModule } from 'src/core/sse/sse.module';
import { AlarmHistoryModule } from 'src/domains/alarm/history/alarm-history/alarm-history.module';
import { SystemModule } from 'src/domains/setting/system/system.module';
import { AlarmMessageDispatchModule } from 'src/domains/alarm/alarm-message-dispatch/alarm-message-dispatch.module';
import { Pagination } from 'src/utils/pagination.util';

@Module({
  imports: [

    TypeOrmModule.forFeature([AlarmQueue]),
    AlarmHistoryModule,
    SseModule,
    SystemModule,
    AlarmMessageDispatchModule,
  ],
  providers: [AlarmQueueService, AlarmQueueRepository, Pagination],
  exports: [AlarmQueueService]
})
export class AlarmQueueModule {}