import { Logger, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ISeeder } from '../../seed.interface';
import { Users } from 'src/domains/users/users/entities/users.entity';
import { MessageDispatchHistory } from 'src/domains/alarm/history/message-dispatch-history/entities/message-dispatch-history.entity';
import { AlarmHistory } from 'src/domains/alarm/history/alarm-history/entities/alarm-history.entity';
import { rand } from 'src/utils/dummy.util';
import { SEND_MESSAGE_TYPE } from 'src/common/enum/alarm.enum';

@Injectable()
export class MessageDispatchHistorySeed implements ISeeder {
    private readonly logger = new Logger(MessageDispatchHistorySeed.name)
    constructor(
    @InjectRepository(MessageDispatchHistory)
    private readonly msgRepository: Repository<MessageDispatchHistory>,
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
    @InjectRepository(AlarmHistory)
    private readonly alarmHistoryRepository: Repository<AlarmHistory>,

  ) {}

  async setupInitialData(insertDebugData : boolean): Promise<void> {
    const cnt = await this.msgRepository.count();
    if (cnt === 0 ){
      await this.insertDefaultData();
      if(insertDebugData) {
        await this.insertTestData();
      }
    }
  }

  async insertDefaultData(): Promise<void> {}
  async insertTestData(): Promise<void> {
    this.logger.log('No MessageDispatchHistory found, inserting debug data...');

    const userList = await this.userRepository.find();

    //getRandomDateWithinLastYear();
    if (!userList) {
        this.logger.log('No foreign key exists for the MessageDispatchHistory');
        return;
    }

   const alarmHistoryList = await this.alarmHistoryRepository.find();
    if (!alarmHistoryList || alarmHistoryList.length === 0) {
        this.logger.log('No foreign key exists for the MessageDispatchHistory');
        return;
    }

    const types = [SEND_MESSAGE_TYPE.SMS, SEND_MESSAGE_TYPE.SNS, SEND_MESSAGE_TYPE.EMAIL];

    const targets: MessageDispatchHistory[] = [];
    for (let i = 0; i < 2000; i++) {
      const usersNo = rand(0, 3);
      const user = userList[usersNo];
      const alarmHistoryNo = rand(0, alarmHistoryList.length -1 );
      const alarmHistory = alarmHistoryList[alarmHistoryNo];
      const typeNo = rand(0, 2);
      const type = types[typeNo];

      const mdh = new MessageDispatchHistory();
      mdh.create_date = alarmHistory.create_date;
      mdh.users = user;
      mdh.alarm_history = alarmHistory;
      mdh.type = type;
      mdh.message = `Alarm message ${i + 1}`;
      mdh.dispatch_success = rand(0, 1) === 1 ? true : false;

      targets.push(mdh);
    }

    const BATCH_SIZE = 1000;

    for (let i = 0; i < targets.length; i += BATCH_SIZE) {
      const batch = targets.slice(i, i + BATCH_SIZE);
      await this.msgRepository.insert(batch);
    }


    this.logger.log('Debug data inserted!');
  }
}
