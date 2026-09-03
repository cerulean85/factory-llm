import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashBoardService } from './dash-board.service';
import { DashBoardController } from './dash-board.controller';
import { AlarmHistoryModule } from 'src/domains/alarm/history/alarm-history/alarm-history.module';
import { CellViewModule } from 'src/collector-interface/view/cell-view/cell-view.module';
import { JobHistoryModule } from 'src/domains/storage/job-history/job-history.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([]),
    JobHistoryModule,
    AlarmHistoryModule,
    CellViewModule,
  ],
  controllers: [DashBoardController],
  providers: [DashBoardService],
  exports: [DashBoardService],
})
export class DashBoardModule {}