import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedService } from './seed.service';
import { Users } from 'src/domains/users/users/entities/users.entity';
import { LoginHistory } from 'src/domains/users/login-history/entities/login-history.entity';
import { UsersSeed } from './domains/user.seed';
import { LoginHistorySeed } from './domains/login-history.seed';
import { Role } from 'src/domains/users/role/entities/role.entity';
import { RoleSeed } from './domains/role.seed';
import { Equipment } from 'src/domains/equipment/equipment/entities/equipment.entity';
import { EquipmentSeed } from './domains/equipment/equipment.seed';
import { EquipmentType } from 'src/domains/equipment/equipment-type/entities/equipment-type.entity';
import { EquipmentTypeSeed } from './domains/equipment/equipment-type.seed';
import { AlarmSeed } from './domains/alarm/alarm.seed';
import { Alarm } from 'src/domains/alarm/alarm/entities/alarm.entity';
import { AlarmHistory } from 'src/domains/alarm/history/alarm-history/entities/alarm-history.entity';
import { AlarmHistorySeed } from './domains/alarm/alarm-history.seed';
import { AlarmUserRelation } from 'src/domains/alarm/alarm-user-relation/entities/alarm-user-relation.entity';
import { AlarmUserRelationSeed } from './domains/alarm/alarm-user-relation.seed';
import { Noti } from 'src/domains/noti/entities/noti.entity';
import { NotiSeed } from './domains/noti.seed';
import { Remote } from 'src/domains/setting/remote/entities/remote.entity';
import { RemoteSeed } from './domains/remote.seed';
import { System } from 'src/domains/setting/system/entities/system.entity';
import { SystemSeed } from './domains/system.seed';
import { PalletSeed } from './domains/storage/pallet.seed';
import { Pallet } from 'src/domains/storage/pallet/entities/pallet.entity';
import { AlarmHistoryProcessByUser } from 'src/domains/alarm/history/alarm-history-process-by-user/entities/alarm-history-process-by-user.entity';
import { AlarmHistoryProcessByUserSeed } from './domains/alarm/alarm-history-process-by-user.seed';
import { Warehouse } from 'src/domains/storage/warehouse/entities/warehouse.entity';
import { WarehouseSeed } from './domains/storage/warehouse.seed';
import { CraneCell } from 'src/domains/__archived__/crane-cell/entities/crane-cell.entity';
import { CraneCellSeed } from './domains/storage/crane-cell.seed';
import { GantryCell } from 'src/domains/__archived__/gantry-cell/entities/gantry-cell.entity';
import { GantryCellSeed } from '../domains/__archived__/seed/gantry-cell.seed';
import { ShippingSpecification } from 'src/domains/storage/shipping-specification/entities/shipping-specification.entity';
import { ShippingSpecificationSeed } from './domains/storage/shipping-specification.seed';
import { Todo } from 'src/domains/todo/entities/todo.entity';
import { TodoSeed } from './domains/todo.seed';
import { EquipmentOperationHistory } from 'src/domains/equipment/equipment-operation-history/entities/equipment-operation-history.entity';
import { EquipmentOperationHistorySeed } from './domains/equipment/equipment-operation-history.seed';
import { MessageDispatchHistory } from 'src/domains/alarm/history/message-dispatch-history/entities/message-dispatch-history.entity';
import { MessageDispatchHistorySeed } from './domains/alarm/message-dispatch-history.seed';
import { SimulatorModule } from './simulator/simulator.module';
import { StoredItem } from 'src/domains/__archived__/item/stored_item/entities/stored-item.entity';
import { StoredItemSeed } from '../domains/__archived__/seed/stored-item.seed';
import { EquipmentAlarmHistory } from 'src/domains/alarm/history/alarm-history/sub-domain/equipment-alarm-history/entities/equipment-alarm-history.entity';
import { EquipmentAlarmHistorySeed } from './domains/alarm/equipment-alarm-history.seed';
import { InventoryAlarmHistory } from 'src/domains/alarm/history/alarm-history/sub-domain/inventory-alarm-history/entities/inventory-alarm-history.entity';
import { InventoryAlarmHistorySeed } from './domains/alarm/inventory-alarm-history.seed';
import { DockView } from 'src/collector-interface/view/dock-view/entities/dock-view.entity';
import { DockViewSeed } from './domains/view/dock-view.seed';
import { RealtimeEquipmentView } from 'src/collector-interface/view/realtime-equipment-view/entities/realtime-equipment-view.entity';
import { RealtimeEquipmentViewSeed } from './domains/view/realtime-equipment-view.seed';
import { RealtimeWarehouseView } from 'src/domains/__archived__/realtime-warehouse-view/entities/realtime-warehouse-view.entity';
import { CellView } from 'src/collector-interface/view/cell-view/entities/cell-view.entity';
import { CellViewSeed } from './domains/view/cell-view.seed';
import { JobHistory } from 'src/domains/storage/job-history/entities/job-history.entity';
import { JobHistorySeed } from './domains/storage/job-history.seed';

@Module({
  imports: [TypeOrmModule.forFeature([
    Users
    , LoginHistory
    , Role
    , EquipmentType
    , Warehouse
    , Equipment
    , Alarm
    , AlarmHistory
    , Noti
    , Remote
    , System
    , AlarmUserRelation
    , AlarmHistoryProcessByUser
    , CraneCell
    , GantryCell
    , Pallet
    , CellView
    , ShippingSpecification
    , Todo
    , EquipmentOperationHistory
    , MessageDispatchHistory
    , StoredItem
    , JobHistory
    , EquipmentAlarmHistory
    , InventoryAlarmHistory
    , DockView
    , RealtimeEquipmentView
    , RealtimeWarehouseView
  ])
    //, InventoryAlarmReleaseModule
    , SimulatorModule


],
  providers: [
    SeedService
    , UsersSeed
    , EquipmentTypeSeed
    , LoginHistorySeed
    , RoleSeed
    , WarehouseSeed
    , EquipmentSeed
    , AlarmSeed
    , AlarmHistorySeed
    , NotiSeed
    , RemoteSeed
    , SystemSeed
    , AlarmUserRelationSeed
    , AlarmHistoryProcessByUserSeed
    , CraneCellSeed
    , GantryCellSeed
    , PalletSeed
    , CellViewSeed
    , ShippingSpecificationSeed
    , TodoSeed
    , EquipmentOperationHistorySeed
    , MessageDispatchHistorySeed
    , StoredItemSeed
    , JobHistorySeed
    , EquipmentAlarmHistorySeed
    , InventoryAlarmHistorySeed
    , DockViewSeed
    , RealtimeEquipmentViewSeed
  ],
  exports: [SeedService],
})
export class SeederModule {}