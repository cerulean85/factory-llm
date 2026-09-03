import { Logger, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from 'src/domains/users/users/entities/users.entity';
import { ISeeder } from '../seed.interface';

import * as bcryptjs from "bcryptjs";
import { HASH_SALT } from '../../config/auth.config';
export const ADMIN_USER = 'admin'

export const UsersSeedList = [
  { seq_id: 1, user_id: ADMIN_USER, password: '!admin123', email: 'admin@hanwha.com', name: '관리자', affiliation: '연구소', phone_number: '010-1234-1234', valid_record: true },
];

@Injectable()
export class UsersSeed implements ISeeder{
    private readonly logger = new Logger(UsersSeed.name)
    constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
  ) {}
  

  async setupInitialData(insertDebugData : boolean): Promise<void> {
    const cnt = await this.usersRepository.count();
    if (cnt === 0 ){
      await this.insertDefaultData();
      if(insertDebugData) {
        await this.insertTestData();
      }
    }
  }

  async insertDefaultData(): Promise<void> {
    this.logger.log('No users found, inserting default data...');

    const hashedUsersSeedList = await Promise.all(
      UsersSeedList.map(async (user) => ({
        ...user,
        password: await bcryptjs.hash(user.password, HASH_SALT),
      }))
    );
    await this.usersRepository.insert(hashedUsersSeedList);

    this.logger.log('Default data inserted!');
  }

  async insertTestData(): Promise<void> {
    this.logger.log('No users found, inserting debug data...');

    this.logger.log('Debug data inserted!');
  }
}