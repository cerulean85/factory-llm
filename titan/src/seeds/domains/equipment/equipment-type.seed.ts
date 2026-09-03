import { Logger, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ISeeder } from '../../seed.interface';
import { EquipmentType } from 'src/domains/equipment/equipment-type/entities/equipment-type.entity';
import { EQUIPMENT_TYPE } from 'src/common/enum/equipment.enum';

@Injectable()
export class EquipmentTypeSeed implements ISeeder {
    private readonly logger = new Logger(EquipmentTypeSeed.name)
    constructor(
    @InjectRepository(EquipmentType)
    private readonly equipmentTypeRepository: Repository<EquipmentType>,

  ) {}

  async setupInitialData(insertDebugData : boolean): Promise<void> {
    const cnt = await this.equipmentTypeRepository.count();
    if (cnt === 0 ){
      await this.insertDefaultData();
      if(insertDebugData) {
        await this.insertTestData();
      }
    }
  }

  async insertDefaultData(): Promise<void> {
    this.logger.log('No equipment type found, inserting data...');

    const EquipmentTypeTesttList = [
      { id : 1, name :'CNV', description: 'CONVEYOR', type: EQUIPMENT_TYPE.CNV},
      { id : 2, name: 'RGV', description: 'RAIL GUIDED VEHICLE', type: EQUIPMENT_TYPE.RGV},
      { id : 3, name: 'STC', description: 'STACKER CRANE', type: EQUIPMENT_TYPE.STC},
      { id : 4, name: 'GTR', description: 'GANTRY', type: EQUIPMENT_TYPE.GTR},
    ];

    await this.equipmentTypeRepository.save(EquipmentTypeTesttList);

    this.logger.log('data inserted!');

  }

  async insertTestData(): Promise<void> {
    this.logger.log('No equipment type found, inserting debug data...');
    this.logger.log('Debug data inserted!');
  }
}
