import { Logger, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ISeeder } from '../seed.interface';
import { Noti } from 'src/domains/noti/entities/noti.entity';
import { Users } from 'src/domains/users/users/entities/users.entity';
import { getRandomDateWithinLastTwoMonths, rand } from 'src/utils/dummy.util';

@Injectable()
export class NotiSeed implements ISeeder {
    private readonly logger = new Logger(NotiSeed.name)
    constructor(
    @InjectRepository(Noti)
    private readonly notiRepository: Repository<Noti>,
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,

  ) {}

  async setupInitialData(insertDebugData : boolean): Promise<void> {
    const cnt = await this.notiRepository.count();
    if (cnt === 0 ){
      await this.insertDefaultData();
      if(insertDebugData) {
        await this.insertTestData();
      }
    }
  }

  async insertDefaultData(): Promise<void> {}
  async insertTestData(): Promise<void> {
    this.logger.log('No noti found, inserting debug data...');

    let userList = await this.userRepository.find();

    if (!userList) {
        this.logger.log('No foreign key exists for the noti');
        return;
    }

    let testData: { title: string; content: string; users: Users; create_date: Date; update_date: Date }[] = [];
    for (let i = 0; i < 50; i++) {
      const user = userList[rand(0, userList.length - 1)];
      const createDate = getRandomDateWithinLastTwoMonths();

      const today = new Date();
      const minTime = createDate.getTime();
      const maxTime = today.getTime();
      const updateTime = minTime + Math.random() * (maxTime - minTime);
      const updateDate = new Date(updateTime);

      testData.push({
        title: `title${i + 1}.`,
        content: `content${i + 1}.`,
        users: user,
        create_date: createDate,
        update_date: updateDate,
      });
    };

    testData.sort((a, b) => a.create_date.getTime() - b.create_date.getTime());

    for (const data of testData) {
      await this.notiRepository.insert(data);
    };
    this.logger.log('Debug data inserted!');
  }
}
