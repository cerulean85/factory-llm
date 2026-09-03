import { Logger, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ISeeder } from '../../seed.interface';
import { AlarmUserRelation } from 'src/domains/alarm/alarm-user-relation/entities/alarm-user-relation.entity';
import { Users } from 'src/domains/users/users/entities/users.entity';
import { Alarm } from 'src/domains/alarm/alarm/entities/alarm.entity';
import { rand } from 'src/utils/dummy.util';

@Injectable()
export class AlarmUserRelationSeed implements ISeeder {
    private readonly logger = new Logger(AlarmUserRelationSeed.name)
    constructor(
    @InjectRepository(AlarmUserRelation)
    private readonly alarmUserRelationRepository: Repository<AlarmUserRelation>,
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
    @InjectRepository(Alarm)
    private readonly alarmRepository: Repository<Alarm>

  ) {}

  async setupInitialData(insertDebugData : boolean): Promise<void> {
    const cnt = await this.alarmUserRelationRepository.count();
    if (cnt === 0 ){
      await this.insertDefaultData();
      if(insertDebugData) {
        await this.insertTestData();
      }
    }
  }

  async insertDefaultData(): Promise<void> {}
  async insertTestData(): Promise<void> {
    this.logger.log('No alarmUserRelation found, inserting debug data...');

    let userList = await this.userRepository.find();
    let alarmList = await this.alarmRepository.find();
    if (!userList || !alarmList) {
      this.logger.log('No foreign key exists for the alarmUsers');
      return;
    }


    for (let i = 0; i < userList.length; i++) {
      const user = userList[i];
      const existsAlarm : number[] = [];
      for (let j = 0; j < 3; j++) {
        const randomAlarmIndex = rand(0, 9);      //알람의 범위가 많아지므로 10개로 제한한다.
        if (existsAlarm.includes(randomAlarmIndex)) {
          continue;
        }
        existsAlarm.push(randomAlarmIndex);
        const alarm = alarmList[randomAlarmIndex];

        const exists = await this.alarmUserRelationRepository.findOne({
          where: { users: user, alarm: alarm },
        })

        if (!exists) {
        await this.alarmUserRelationRepository.insert({
          users: user,
          alarm: alarm,
        })};
      }
    }
    this.logger.log('Debug data inserted!');
  }
}
