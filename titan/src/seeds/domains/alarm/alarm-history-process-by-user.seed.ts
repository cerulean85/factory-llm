import { Logger, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ISeeder } from '../../seed.interface';
import { AlarmHistoryProcessByUser } from 'src/domains/alarm/history/alarm-history-process-by-user/entities/alarm-history-process-by-user.entity';
import { Users } from 'src/domains/users/users/entities/users.entity';
import { AlarmHistory } from 'src/domains/alarm/history/alarm-history/entities/alarm-history.entity';
import { rand } from 'src/utils/dummy.util';


@Injectable()
export class AlarmHistoryProcessByUserSeed implements ISeeder {
    private readonly logger = new Logger(AlarmHistoryProcessByUserSeed.name)
    constructor(
    @InjectRepository(AlarmHistoryProcessByUser)
    private readonly relationRepository: Repository<AlarmHistoryProcessByUser>,
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
    @InjectRepository(AlarmHistory)
    private readonly alarmHistoryRepository: Repository<AlarmHistory>

  ) {}

  async setupInitialData(insertDebugData : boolean): Promise<void> {
    const cnt = await this.relationRepository.count();
    if (cnt === 0 ){
      await this.insertDefaultData();
      if(insertDebugData) {
        await this.insertTestData();
      }
    }
  }

  async insertDefaultData(): Promise<void> {}
  async insertTestData(): Promise<void> {

    this.logger.log('No alarmHistoryProcessByUser found, inserting debug data...');

    let userList = await this.userRepository.find();
    let alarmHistoryList = await this.alarmHistoryRepository.find();
    if (!userList || !alarmHistoryList) {
      this.logger.log('No foreign key exists for the alarmHistoryProcessByUser');
      return;
    }


    const insertArray = [] as AlarmHistoryProcessByUser[];

    for (const alarmHistory of alarmHistoryList) {
      // 선택할 유저 수 결정 (최소 1명, 최대 전체 수)
      const selectCount = rand(1, userList.length);

      // 인덱스를 중복 없이 랜덤으로 선택
      const selectedIndices = new Set<number>();
      while (selectedIndices.size < selectCount) {
        const idx = rand(0, userList.length - 1);
        selectedIndices.add(idx);
      }

      // 선택된 유저들을 기준으로 엔티티 생성
      for (const idx of selectedIndices) {
        const user = userList[idx];
        const entity = this.relationRepository.create({
          users: user,
          alarm_history: alarmHistory,
        });
        insertArray.push(entity);
      }
    }

    const BATCH_SIZE = 1000;

    for (let i = 0; i < insertArray.length; i += BATCH_SIZE) {
      const batch = insertArray.slice(i, i + BATCH_SIZE);
      await this.relationRepository.save(batch);
    }

    this.logger.log('Debug data inserted!');
    
  }
}
