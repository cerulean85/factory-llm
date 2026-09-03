import { Logger, Injectable, NotFoundException } from '@nestjs/common';
import { ISeeder } from './seed.interface';

import { UsersSeed } from './domains/user.seed';
import { LoginHistorySeed } from './domains/login-history.seed';
import { RoleSeed } from './domains/role.seed';
import { EquipmentTypeSeed } from './domains/equipment/equipment-type.seed';
import { EquipmentSeed } from './domains/equipment/equipment.seed';
import { AlarmSeed } from './domains/alarm/alarm.seed';
import { AlarmHistorySeed } from './domains/alarm/alarm-history.seed';
import { NotiSeed } from './domains/noti.seed';
import { PalletSeed } from './domains/storage/pallet.seed';
import { RemoteSeed } from './domains/remote.seed';
import { SystemSeed } from './domains/system.seed';
import { AlarmUserRelationSeed } from './domains/alarm/alarm-user-relation.seed';
import { AlarmHistoryProcessByUserSeed } from './domains/alarm/alarm-history-process-by-user.seed';
import { WarehouseSeed } from './domains/storage/warehouse.seed';
import { CraneCellSeed } from './domains/storage/crane-cell.seed';
import { DEBUG_INSERT_DATA } from 'src/config/debug.config';
import { GantryCellSeed } from '../domains/__archived__/seed/gantry-cell.seed';
import { ShippingSpecificationSeed } from './domains/storage/shipping-specification.seed';
import { TodoSeed } from './domains/todo.seed';
import { EquipmentOperationHistorySeed } from './domains/equipment/equipment-operation-history.seed';
//import { InventoryAlarmReleaseService } from 'src/domains/inventory_alarm_release/inventory_alarm_release.service';
import { MessageDispatchHistorySeed } from './domains/alarm/message-dispatch-history.seed';
import { CreateSeedOptionDto } from './dto/create-seed-option.dto';
import { StoredItemSeed } from '../domains/__archived__/seed/stored-item.seed';
import { EquipmentAlarmHistorySeed } from './domains/alarm/equipment-alarm-history.seed';
import { InventoryAlarmHistorySeed } from './domains/alarm/inventory-alarm-history.seed';
import { DockViewSeed } from './domains/view/dock-view.seed';
import { RealtimeEquipmentViewSeed } from './domains/view/realtime-equipment-view.seed';
import { CellViewSeed } from './domains/view/cell-view.seed';
import { JobHistorySeed } from './domains/storage/job-history.seed';

@Injectable()
export class SeedService {

  public static SEED_VERSION = 63.0;

  private readonly seeders : ISeeder[];
  private readonly logger = new Logger(SeedService.name);

  constructor(
    private readonly usersSeed: UsersSeed,
    private readonly loginHistorySeed: LoginHistorySeed,
    private readonly roleSeed: RoleSeed,
    private readonly equipmentTypeSeed: EquipmentTypeSeed,
    private readonly equipmentSeed: EquipmentSeed,
    private readonly alarmSeed: AlarmSeed,
    private readonly alarmHistorySeed: AlarmHistorySeed,
    private readonly notiSeed: NotiSeed,
    private readonly remoteSeed: RemoteSeed,
    private readonly systemSeed: SystemSeed,
    private readonly palletSeed: PalletSeed,
    private readonly cellViewSeed: CellViewSeed,
    private readonly alarmUserRelationSeed: AlarmUserRelationSeed,
    private readonly alarmHistoryProcessByUserSeed: AlarmHistoryProcessByUserSeed,
    private readonly warehouseSeed: WarehouseSeed,
    private readonly craneCellSeed: CraneCellSeed,
    private readonly gantryCellSeed: GantryCellSeed,
    private readonly shippingSpecificationSeed: ShippingSpecificationSeed,
    private readonly todoSeed: TodoSeed,
    private readonly equipmentOperationHistorySeed: EquipmentOperationHistorySeed,
    private readonly messageDispatchHistorySeed: MessageDispatchHistorySeed,
    private readonly storedItemSeed: StoredItemSeed,
    private readonly equipmentAlarmHistorySeed: EquipmentAlarmHistorySeed,
    private readonly inventoryAlarmHistorySeed: InventoryAlarmHistorySeed,
    private readonly dockViewSeed: DockViewSeed,
    private readonly realtimeViewSeed: RealtimeEquipmentViewSeed,
    private readonly jobHistorySeed: JobHistorySeed,
    //private readonly inventoryAlarmReleaseService : InventoryAlarmReleaseService
  ) {
    this.seeders = [usersSeed
      , loginHistorySeed
      , roleSeed
      , warehouseSeed
      , equipmentTypeSeed
      , equipmentSeed
      , alarmSeed
      , alarmHistorySeed
      , notiSeed
      , remoteSeed
      , systemSeed
      , alarmUserRelationSeed
      , alarmHistoryProcessByUserSeed
      , craneCellSeed
      , gantryCellSeed
      , palletSeed
      , cellViewSeed
      , shippingSpecificationSeed
      , todoSeed
      , equipmentOperationHistorySeed
      , messageDispatchHistorySeed
      , storedItemSeed
      , jobHistorySeed
      , equipmentAlarmHistorySeed
      , inventoryAlarmHistorySeed
      , dockViewSeed
      , realtimeViewSeed

    ];
  }
  async onModuleInit() {

  }


  async runAllSeeders() {
    for (const seeder of this.seeders) {
      try {
        await seeder.setupInitialData(DEBUG_INSERT_DATA);
      } catch (error) {
        this.logger.error(
          `An error occurred while inserting debug data in ${seeder.constructor.name}`,
          error.stack
        );
      }
    }

    // Seed작업 끝나고 실행되어야할 작업
    //this.inventoryAlarmReleaseService.startScheduledTaskAfterInit();
    
    
  }
}