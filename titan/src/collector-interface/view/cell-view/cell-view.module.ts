import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CellView } from './entities/cell-view.entity';
import { CellViewService } from './cell-view.service';
import { CellViewController } from './cell-view.controller';
import { CellViewRepository } from './repositories/cell-view.repository';
import { Pagination } from 'src/utils/pagination.util';
import { CraneCellViewService } from './crane-cell-view.service';
import { CraneCellViewController } from './crane-cell-view.controller';
import { CraneCellViewStatsRepository } from './repositories/crane-cell-view.stats.repository';
import { PalletModule } from 'src/domains/storage/pallet/pallet.module';
import { GantryCellViewService } from './gantry-cell-view.service';
import { GantryCellViewController } from './gantry-cell-view.controller';
import { GantryCellViewStatsRepository } from './repositories/gantry-cell-view.stats.repository';
import { SystemModule } from 'src/domains/setting/system/system.module';
import { AlarmHistoryModule } from 'src/domains/alarm/history/alarm-history/alarm-history.module';
import { SseModule } from 'src/core/sse/sse.module';
import { WarehouseModule } from 'src/domains/storage/warehouse/warehouse.module';
import { AlarmMessageDispatchModule } from 'src/domains/alarm/alarm-message-dispatch/alarm-message-dispatch.module';
import { UsersModule } from 'src/domains/users/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CellView]),
    PalletModule,
    SystemModule,
    AlarmHistoryModule,
    SseModule,
    WarehouseModule,
    AlarmMessageDispatchModule,
    UsersModule,
  ],
  controllers: [CellViewController, CraneCellViewController, GantryCellViewController],
  providers: [CellViewRepository,
    CellViewService,
    Pagination,
    CraneCellViewService,
    CraneCellViewStatsRepository,
    GantryCellViewService,
    GantryCellViewStatsRepository],
  exports: [CellViewService, CraneCellViewService, GantryCellViewService]
})
export class CellViewModule {}