import { Logger, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ISeeder } from '../../seed.interface';
import { AlarmHistory } from 'src/domains/alarm/history/alarm-history/entities/alarm-history.entity';
import { ALARM_HISTORY_TYPE, ALERT_TYPE, INVENTORY_ALARM_TYPE } from 'src/common/enum/alarm.enum';
import { rand, stdTypes } from 'src/utils/dummy.util';
import { InventoryAlarmHistory } from 'src/domains/alarm/history/alarm-history/sub-domain/inventory-alarm-history/entities/inventory-alarm-history.entity';
import { Warehouse } from 'src/domains/storage/warehouse/entities/warehouse.entity';
import { WAREHOUSE_TYPE } from 'src/common/enum/equipment.enum';

@Injectable()
export class InventoryAlarmHistorySeed implements ISeeder {
    private readonly logger = new Logger(InventoryAlarmHistorySeed.name)
    constructor(
    @InjectRepository(AlarmHistory)
    private readonly alarmHistoryRepository: Repository<AlarmHistory>,
    @InjectRepository(InventoryAlarmHistory)
    private readonly inventoryAlarmHistoryRepository: Repository<InventoryAlarmHistory>,
    @InjectRepository(Warehouse)
    private readonly warehouseRepository: Repository<Warehouse>

  ) {}
  async setupInitialData(insertDebugData : boolean): Promise<void> {
    const cnt = await this.inventoryAlarmHistoryRepository.count();
    if (cnt === 0 ){
      await this.insertDefaultData();
      if(insertDebugData) {
        await this.insertTestData();
      }
    }
  }

  async insertDefaultData(): Promise<void> {}
  async insertTestData(): Promise<void> {
    this.logger.log('No alarmHistory found, inserting debug data...');

    let testData: InventoryAlarmHistory[] = [];

    let alarmHistoryEntities = await this.alarmHistoryRepository.find( { where: { type: ALARM_HISTORY_TYPE.INVENTORY },});
    const warehouseList = await this.warehouseRepository.find();

    for (let i = 0; i < alarmHistoryEntities.length; i++) {

      const invAlarmHistory = new InventoryAlarmHistory();
      invAlarmHistory.alarm_history = alarmHistoryEntities[i];
      invAlarmHistory.id = i;

      const warehouse = warehouseList[rand(0, warehouseList.length - 1)];
      const standardTypeNo = rand(0, 7);
      const stdType = stdTypes[standardTypeNo];
      invAlarmHistory.standard_type = stdType;
      invAlarmHistory.stored_item_count = rand(1, 200);
      invAlarmHistory.inventory_alarm_type = rand(0,2) === 2 ? INVENTORY_ALARM_TYPE.LONG_TERM : INVENTORY_ALARM_TYPE.STORED;
      invAlarmHistory.alert_type = rand(0,1) === 1 ? ALERT_TYPE.DANGER : ALERT_TYPE.WARNING;
      invAlarmHistory.warehouse_name = warehouse.name;
      invAlarmHistory.warehouse_code = warehouse.code;
      invAlarmHistory.warehouse_type = warehouse.type as WAREHOUSE_TYPE;

      testData.push(invAlarmHistory);
    }

    const BATCH_SIZE = 1000;

    for (let i = 0; i < testData.length; i += BATCH_SIZE) {
      const batch = testData.slice(i, i + BATCH_SIZE);
      await this.inventoryAlarmHistoryRepository.insert(batch);
    }
    
    this.logger.log('Debug data inserted!');
  }
}
