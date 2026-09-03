import { Logger, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ISeeder } from '../../seed.interface';
import { Alarm } from 'src/domains/alarm/alarm/entities/alarm.entity';
import { readCsvToObject } from 'src/utils/csv.util';
import * as path from 'path';
import { ALARM_HISTORY_TYPE } from 'src/common/enum/alarm.enum';
import { EquipmentType } from 'src/domains/equipment/equipment-type/entities/equipment-type.entity';

@Injectable()
export class AlarmSeed implements ISeeder {
    private readonly logger = new Logger(AlarmSeed.name)
    constructor(
    @InjectRepository(Alarm)
    private readonly alarmRepository: Repository<Alarm>,
  ) {}

  async setupInitialData(insertDebugData : boolean): Promise<void> {
    const cnt = await this.alarmRepository.count();
    if (cnt === 0 ){
      await this.insertDefaultData();
      if(insertDebugData) {
        await this.insertTestData();
      }
    }
  }

  async insertDefaultData(): Promise<void> {
    this.logger.log('No alarm found, inserting default data...');
    const filePath = path.join(__dirname, '../../default-data', 'ERR_CODE3.csv');
    const errCodeList = await readCsvToObject(filePath);
    const alarmList : Alarm[] = [];
      
    for (const errCode of errCodeList) {
      const alarm = new Alarm();
      alarm.code = errCode['ERR_CODE'];
      alarm.valid_record = true;
      alarm.send_enabled = true;
      alarm.description = errCode['DESCRIPTION'];
      alarm.process_method = errCode['PROCESS_METHOD'];
      alarm.type = ALARM_HISTORY_TYPE.EQUIPMENT;
        
      switch(errCode['IMPORTANCE']){
        case '하': alarm.importance = 1; break;
        case '중': alarm.importance = 2; break;
        case '상': alarm.importance = 3; break;
        default: this.logger.log('No importance exists for the alarm'); continue;
      }
        
      switch(errCode['EQUIPMENT']){
        case 'CNV': alarm.equipment_type = { id: 1 } as EquipmentType; break;
        case 'RGV': alarm.equipment_type = { id: 2 } as EquipmentType; break;
        case 'STC': alarm.equipment_type = { id: 3 } as EquipmentType; break;
        case 'GTR': alarm.equipment_type = { id: 4 } as EquipmentType; break;
      }
        
      switch(errCode['RESET_AVAILABLE']){
        case 'O': alarm.reset_available = true; break;
        default: alarm.reset_available = false; break;
      }
      alarmList.push(alarm);
    }
    await this.alarmRepository.insert(alarmList);
    this.logger.log('Default data inserted!');
  }

  async insertTestData(): Promise<void> {
    this.logger.log('No alarm found, inserting debug data...');
    this.logger.log('Debug data inserted!');
  }
}
