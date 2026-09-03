import { Logger, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ISeeder } from '../seed.interface';
import { System } from 'src/domains/setting/system/entities/system.entity';
import { Users } from 'src/domains/users/users/entities/users.entity';

@Injectable()
export class SystemSeed implements ISeeder {
    private readonly logger = new Logger(SystemSeed.name)
    constructor(
    @InjectRepository(System)
    private readonly systemRepository: Repository<System>,

  ) {}


  async setupInitialData(insertDebugData : boolean): Promise<void> {
    const cnt = await this.systemRepository.count();
    if (cnt === 0 ){
      await this.insertDefaultData();
      if(insertDebugData) {
        await this.insertTestData();
      }
    }
  }


  async insertDefaultData(): Promise<void> {}
  async insertTestData(): Promise<void> {
      this.logger.log('No system found, inserting debug data...');

      await this.systemRepository.insert([
        { alarm_send_enabled : true,
          equipment_alarm_enabled: true,
          inventory_alarm_enabled: true,
          inventory_alarm_remaining_day: 50,
          load_warning_ratio_crane: 80,
          load_danger_ratio_crane: 90,
          load_warning_color_crane: '##FF00FF',
          load_danger_color_crane: '##FF00FF',
          load_warning_ratio_gantry: 80,
          load_danger_ratio_gantry: 90,
          load_warning_color_gantry: '##FF00FF',
          load_danger_color_gantry: '##FF00FF' },
      ]);
      this.logger.log('Debug data inserted!');
  }
}