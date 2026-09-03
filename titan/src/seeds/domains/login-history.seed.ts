import { Logger, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoginHistory } from 'src/domains/users/login-history/entities/login-history.entity';
import { Users } from 'src/domains/users/users/entities/users.entity';
import { ISeeder } from '../seed.interface';
import { getRandomDateWithinLastTwoMonths, rand } from 'src/utils/dummy.util';

@Injectable()
export class LoginHistorySeed implements ISeeder {
    private readonly logger = new Logger(LoginHistorySeed.name)
    constructor(
    @InjectRepository(LoginHistory)
    private readonly loginHistoryRepository: Repository<LoginHistory>,

    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>
  ) {}

  async setupInitialData(insertDebugData : boolean): Promise<void> {
    const cnt = await this.loginHistoryRepository.count();
    if (cnt === 0 ){
      await this.insertDefaultData();
      if(insertDebugData) {
        await this.insertTestData();
      }
    }
  }
  
  async insertDefaultData(): Promise<void> {}
  async insertTestData(): Promise<void> {
    this.logger.log('No LoginHistory found, inserting debug data...');

    let userList = await this.userRepository.find();
    if (!userList || userList.length === 0) {
        this.logger.log('No foreign key exists for the loginHistory');
        return;
    }
    const ipList = ['172.22.51.222', '192.22.51.222', '172.32.51.235', '192.22.51.321'];

    const testData: { try_ip: string; users: Users; create_date: Date }[] = [];
    for (let i = 0; i < 100; i++) {
      const randomIp = ipList[rand(0, ipList.length - 1)];
      const randomUser = userList[rand(0, userList.length - 1)];
      const randomDate = getRandomDateWithinLastTwoMonths();
      testData.push({
        try_ip: randomIp,
        users: randomUser,
        create_date: randomDate,
      });
    }

    testData.sort((a, b) => a.create_date.getTime() - b.create_date.getTime());

    for (const data of testData) {
      await this.loginHistoryRepository.insert(data);
    }
    this.logger.log('Debug data inserted!');
  }
}
