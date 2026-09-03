import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Pagination } from 'src/utils/pagination.util';
import { AlarmHistoryModule } from '../../alarm/history/alarm-history/alarm-history.module';
import { LongTermItemAlarmHistory } from './entities/long-term-item-alarm-history.entity';
import { LongTermItemAlarmHistoryService } from './long-term-item-alarm-history.service';
import { LongTermItemAlarmHistoryRepository } from './repositories/long-term-item-alarm-history.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([LongTermItemAlarmHistory]),
    AlarmHistoryModule,
],
  providers: [
    LongTermItemAlarmHistoryService,
    LongTermItemAlarmHistoryRepository,
    Pagination],
  exports: [LongTermItemAlarmHistoryService]
})

export class LongTermItemAlarmHistoryModule {}