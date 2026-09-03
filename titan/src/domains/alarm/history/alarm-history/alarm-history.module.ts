import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AlarmHistory } from './entities/alarm-history.entity';
import { AlarmHistoryRepository } from './repositories/alarm-history.repository';
import { AlarmHistoryService } from './alarm-history.service';
import { Pagination } from 'src/utils/pagination.util';
import { AlarmHistoryProcessByUserModule } from '../alarm-history-process-by-user/alarm-history-process-by-user.module';
import { AlarmHistoryStatsRepository } from './repositories/alarm-history.stats.repository';
import { AlarmHistoryBaseRepository } from './repositories/alarm-history.base.repository';
import { AlarmHistoryController } from './alarm-history.controller';
import { EquipmentAlarmHistoryService } from './sub-domain/equipment-alarm-history/equipment-alarm-history.service';
import { EquipmentAlarmHistoryRepository } from './sub-domain/equipment-alarm-history/repositories/equipment-alarm-history.repository';
import { EquipmentAlarmHistoryStatsRepository } from './sub-domain/equipment-alarm-history/repositories/equipment-alarm-history.stats.repository';
import { EquipmentAlarmHistoryController } from './sub-domain/equipment-alarm-history/equipment-alarm-history.controller';
import { EquipmentAlarmHistory } from './sub-domain/equipment-alarm-history/entities/equipment-alarm-history.entity';
import { AlarmModule } from '../../alarm/alarm.module';
import { InventoryAlarmHistoryService } from './sub-domain/inventory-alarm-history/inventory-alarm-history.service';
import { InventoryAlarmHistoryRepository } from './sub-domain/inventory-alarm-history/repositories/inventory-alarm-history.repository';
import { InventoryAlarmHistoryController } from './sub-domain/inventory-alarm-history/inventory-alarm-history.controller';
import { InventoryAlarmHistory } from './sub-domain/inventory-alarm-history/entities/inventory-alarm-history.entity';
import { PalletAlarmHistoryRepository } from './sub-domain/pallet-alarm-history/repositories/pallet-alarm-history.repository';
import { PalletAlarmHistoryService } from './sub-domain/pallet-alarm-history/pallet-alarm-history.service';
import { PalletAlarmHistoryController } from './sub-domain/pallet-alarm-history/pallet-alarm-history.controller';
import { UsersModule } from 'src/domains/users/users/users.module';
import { AlarmMessageDispatchModule } from '../../alarm-message-dispatch/alarm-message-dispatch.module';
import { PalletAlarmHistory } from './sub-domain/pallet-alarm-history/entities/pallet-alarm-history.entity';
import { FileModule } from 'src/core/file/file.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AlarmHistory, EquipmentAlarmHistory, InventoryAlarmHistory, PalletAlarmHistory]),
    AlarmModule,
    forwardRef(() => AlarmHistoryProcessByUserModule), //관계 테이블. 상호참조 해야함.
    FileModule,
],
  providers: [
    AlarmHistoryService, 
    AlarmHistoryBaseRepository,
    AlarmHistoryRepository, 
    AlarmHistoryStatsRepository,

    EquipmentAlarmHistoryService,
    EquipmentAlarmHistoryRepository,
    EquipmentAlarmHistoryStatsRepository,

    InventoryAlarmHistoryService,
    InventoryAlarmHistoryRepository,

    PalletAlarmHistoryRepository,
    PalletAlarmHistoryService,
    
    Pagination,
  ],
  controllers: [
    AlarmHistoryController,
    EquipmentAlarmHistoryController,
    InventoryAlarmHistoryController,
    PalletAlarmHistoryController,
  ],
  exports: [
    AlarmHistoryService,
    EquipmentAlarmHistoryService,
    InventoryAlarmHistoryService,
    PalletAlarmHistoryService,
  ]
})

export class AlarmHistoryModule {}