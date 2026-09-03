import { Logger, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ISeeder } from '../../seed.interface';
import { AlarmHistory } from 'src/domains/alarm/history/alarm-history/entities/alarm-history.entity';
import { getRandomDateWithinLastTwoMonths, rand } from 'src/utils/dummy.util';
import { ALARM_HISTORY_TYPE } from 'src/common/enum/alarm.enum';

@Injectable()
export class AlarmHistorySeed implements ISeeder {
    private readonly logger = new Logger(AlarmHistorySeed.name)
    constructor(
    @InjectRepository(AlarmHistory)
    private readonly alarmHistoryRepository: Repository<AlarmHistory>,
  ) {}
  async setupInitialData(insertDebugData : boolean): Promise<void> {
    const cnt = await this.alarmHistoryRepository.count();
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

    let testData: AlarmHistory[] = [];
    for (let i = 0; i < 1000; i++) {
      const createDate = getRandomDateWithinLastTwoMonths();
      const today = new Date();
      const minTime = createDate.getTime();
      const maxTime = today.getTime();
      const processTime = minTime + Math.random() * (maxTime - minTime);
      const processDate = new Date(processTime);
      const isProcess = rand(0, 1);

      const alarmHistory = new AlarmHistory();
      alarmHistory.create_date = getRandomDateWithinLastTwoMonths();
      if(isProcess === 0){
        alarmHistory.process_date = processDate;
        alarmHistory.process_message = `Process message ${i + 1}`;
      }

      alarmHistory.update_date = processDate;
      alarmHistory.message = `Alarm message ${i + 1}`;

      if(i < 300) alarmHistory.type = ALARM_HISTORY_TYPE.EQUIPMENT
      else alarmHistory.type = ALARM_HISTORY_TYPE.INVENTORY

      testData.push(alarmHistory);
    }

    testData.sort((a, b) => a.create_date.getTime() - b.create_date.getTime());

    const BATCH_SIZE = 1000;

    for (let i = 0; i < testData.length; i += BATCH_SIZE) {
      const batch = testData.slice(i, i + BATCH_SIZE);
      await this.alarmHistoryRepository.insert(batch);
    }
    
    this.logger.log('Debug data inserted!');
  }
}
