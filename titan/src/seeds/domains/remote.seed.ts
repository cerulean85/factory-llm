import { Logger, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ISeeder } from '../seed.interface';
import { Remote } from 'src/domains/setting/remote/entities/remote.entity';
import { Users } from 'src/domains/users/users/entities/users.entity';

@Injectable()
export class RemoteSeed implements ISeeder {
    private readonly logger = new Logger(RemoteSeed.name)
    constructor(
    @InjectRepository(Remote)
    private readonly remoteRepository: Repository<Remote>,
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,

  ) {}

  async setupInitialData(insertDebugData : boolean): Promise<void> {
    const cnt = await this.remoteRepository.count();
    if (cnt === 0 ){
      await this.insertDefaultData();
      if(insertDebugData) {
        await this.insertTestData();
      }
    }
  }

  async insertDefaultData(): Promise<void> {}
  async insertTestData(): Promise<void> {
      this.logger.log('No remote found, inserting debug data...');

      let usersList = await this.usersRepository.find();

      if (!usersList) {
          this.logger.log('No foreign key exists for the users');
          return;
      }

      await this.remoteRepository.insert([
        { location: '테스트 데이터1', ip: '111.111.111.111', port: 1234, users: usersList[0] },
        { location: '테스트 데이터2', ip: '000.000.000.000', port: 2345, users: usersList[0] },
        { location: '테스트 데이터3', ip: '222.222.222.222', port: 9999, users: usersList[1] },
        { location: '테스트 데이터4', ip: '333.333.333.333', port: 8888, users: usersList[1] },
      ]);
      this.logger.log('Debug data inserted!');
  }
}