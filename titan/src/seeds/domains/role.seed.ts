import { Logger, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from 'src/domains/users/users/entities/users.entity';
import { ISeeder } from '../seed.interface';
import { Role } from 'src/domains/users/role/entities/role.entity';
import { ROLE_TYPE } from 'src/common/enum/users.enum';
import { ADMIN_USER } from './user.seed';

@Injectable()
export class RoleSeed implements ISeeder {
    private readonly logger = new Logger(RoleSeed.name)
    constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,

    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>
  ) {}

  async setupInitialData(insertDebugData : boolean): Promise<void> {
    const cnt = await this.roleRepository.count();
    if (cnt === 0 ){
      await this.insertDefaultData();
      if(insertDebugData) {
        await this.insertTestData();
      }
    }
  }

  async insertDefaultData(): Promise<void> {
    this.logger.log('No role found, inserting default data...');
    let adminUser = await this.userRepository.findOne({ where: {user_id: ADMIN_USER} });
    if (!adminUser) {
        this.logger.log('No data found.');
        return;
    }
    await this.roleRepository.insert([
      { type: ROLE_TYPE.ADMIN, valid_record: true, users: adminUser },
    ]);
    this.logger.log('Default data inserted!');
  }
  async insertTestData(): Promise<void> {
    this.logger.log('No role found, inserting debug data...');

    let user1 = await this.userRepository.findOne({ where: {user_id: 'admin'} });
    if (!user1) {
        this.logger.log('No data found.');
        return;
    }
    await this.roleRepository.insert([
      { type: ROLE_TYPE.ADMIN, valid_record: true, users: user1 },
    ]);
    this.logger.log('Debug data inserted!');
  }
}
