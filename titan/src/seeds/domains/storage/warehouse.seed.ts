import { Logger, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ISeeder } from '../../seed.interface';
import { Warehouse } from 'src/domains/storage/warehouse/entities/warehouse.entity';
import { WAREHOUSE_TYPE } from 'src/common/enum/equipment.enum';

@Injectable()
export class WarehouseSeed implements ISeeder {
    private readonly logger = new Logger(WarehouseSeed.name)
    constructor(
    @InjectRepository(Warehouse)
    private readonly warehouseRepository: Repository<Warehouse>,

  ) {}


  async setupInitialData(insertDebugData : boolean): Promise<void> {
    const cnt = await this.warehouseRepository.count();
    if (cnt === 0 ){
      await this.insertDefaultData();
      if(insertDebugData) {
        await this.insertTestData();
      }
    }
  }

  async insertDefaultData(): Promise<void> {
    const cnt = await this.warehouseRepository.count();

    if (cnt === 0) {
      this.logger.log('No warehouse found, inserting debug data...');

      await this.warehouseRepository.insert([
        { id: 1, type: WAREHOUSE_TYPE.CRANE, code: 'PC1', name: 'STACKER_CRANE' },
        { id: 2, type: WAREHOUSE_TYPE.GANTRY, code: 'G01', name: 'GANTRY1' },
        { id: 3, type: WAREHOUSE_TYPE.GANTRY, code: 'G02', name: 'GANTRY2' },
        { id: 4, type: WAREHOUSE_TYPE.GANTRY, code: 'G03', name: 'GANTRY3' },
        { id: 5, type: WAREHOUSE_TYPE.GANTRY, code: 'G04', name: 'GANTRY4' },
        { id: 6, type: WAREHOUSE_TYPE.GANTRY, code: 'G05', name: 'GANTRY5' },
        { id: 7, type: WAREHOUSE_TYPE.GANTRY, code: 'G06', name: 'GANTRY6' },
        { id: 8, type: WAREHOUSE_TYPE.GANTRY, code: 'G07', name: 'GANTRY7' },
        { id: 9, type: WAREHOUSE_TYPE.ETC, code: 'DUMMY', name: 'DUMMY' },

      ]);
      this.logger.log('Debug data inserted!');
    }
  }
  async insertTestData(): Promise<void> {

  }
}
