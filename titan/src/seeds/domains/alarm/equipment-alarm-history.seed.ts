import { Logger, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ISeeder } from '../../seed.interface';
import { AlarmHistory } from 'src/domains/alarm/history/alarm-history/entities/alarm-history.entity';
import { Alarm } from 'src/domains/alarm/alarm/entities/alarm.entity';
import { EquipmentAlarmHistory } from 'src/domains/alarm/history/alarm-history/sub-domain/equipment-alarm-history/entities/equipment-alarm-history.entity';
import { ALARM_HISTORY_TYPE } from 'src/common/enum/alarm.enum';
import { rand } from 'src/utils/dummy.util';
import { Equipment } from 'src/domains/equipment/equipment/entities/equipment.entity';

@Injectable()
export class EquipmentAlarmHistorySeed implements ISeeder {
    private readonly logger = new Logger(EquipmentAlarmHistorySeed.name)
    constructor(
    @InjectRepository(AlarmHistory)
    private readonly alarmHistoryRepository: Repository<AlarmHistory>,
    @InjectRepository(Alarm)
    private readonly alarmRepository: Repository<Alarm>,
    @InjectRepository(EquipmentAlarmHistory)
    private readonly equipmentAlarmHistoryRepository: Repository<EquipmentAlarmHistory>,
    @InjectRepository(Equipment)
    private readonly equipmentRepository: Repository<Equipment>

  ) {}
  async setupInitialData(insertDebugData : boolean): Promise<void> {
    const cnt = await this.equipmentAlarmHistoryRepository.count();
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

    let testData: EquipmentAlarmHistory[] = [];
    let alarmList = await this.alarmRepository.find({ relations: ['equipment_type']});
    if (!alarmList || alarmList.length === 0) {
        this.logger.log('No foreign key exists for the alarm history');
        return;
    }

    let alarmHistoryEntities = await this.alarmHistoryRepository.find( { where: { type: ALARM_HISTORY_TYPE.EQUIPMENT } });
    let equipmentEntities = await this.equipmentRepository.find({ relations: ['equipment_type']});

    for (let i = 0; i < alarmHistoryEntities.length; i++) {
      const randomAlarm = alarmList[rand(0, 9)];    //모든 알람에 대해서 처리하려니, 테스트가 안된다. 10개로 제한한다.
      const equipmentList = equipmentEntities.filter(equipment => equipment.equipment_type.id === randomAlarm.equipment_type.id);
      const randomEquipment = equipmentList[rand(0, equipmentList.length - 1)];

      const equipAlarmHistory = new EquipmentAlarmHistory();
      equipAlarmHistory.alarm = randomAlarm;
      equipAlarmHistory.alarm_history = alarmHistoryEntities[i];
      equipAlarmHistory.id = i;
      equipAlarmHistory.equipment_name = randomEquipment.name;
      equipAlarmHistory.equipment_code = randomEquipment.code;

      testData.push(equipAlarmHistory);
    }


    const BATCH_SIZE = 1000;

    for (let i = 0; i < testData.length; i += BATCH_SIZE) {
      const batch = testData.slice(i, i + BATCH_SIZE);
      await this.equipmentAlarmHistoryRepository.insert(batch);
    }
    
    this.logger.log('Debug data inserted!');
  }
}
