import { Logger, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ISeeder } from '../../seed.interface';
import { getRandomDateWithinLastTwoMonths, rand, stdTypes } from 'src/utils/dummy.util';
import { RealtimeEquipmentView } from 'src/collector-interface/view/realtime-equipment-view/entities/realtime-equipment-view.entity';
import { Equipment } from 'src/domains/equipment/equipment/entities/equipment.entity';
import { ACTION_TYPE, OPERATION_STATUS, TASK_TYPE, TWIN_STATUS } from 'src/common/enum/equipment.enum';

@Injectable()
export class RealtimeEquipmentViewSeed implements ISeeder {
    private readonly logger = new Logger(RealtimeEquipmentViewSeed.name)
    constructor(
    @InjectRepository(RealtimeEquipmentView)
    private readonly repository: Repository<RealtimeEquipmentView>,
    @InjectRepository(Equipment)
    private readonly equipmentRepository: Repository<Equipment>,

  ) {}

  async setupInitialData(insertDebugData : boolean): Promise<void> {
    const cnt = await this.repository.count();
    if (cnt === 0 ){
      await this.insertDefaultData();
      if(insertDebugData) {
        await this.insertTestData();
      }
    }
  }

  async insertDefaultData(): Promise<void> {}
  async insertTestData(): Promise<void> {
    this.logger.log('No realtime view found, inserting debug data...');

    let equipmentList = await this.equipmentRepository.find({where: {valid_record: true}, relations: ['equipment_type']});

    if (!equipmentList) {
        this.logger.log('No foreign key exists for the realtime view');
        return;
    }

    const targetList : RealtimeEquipmentView[] = [];
    for (const equipment of equipmentList) {
      const target = new RealtimeEquipmentView();
      const standardType = stdTypes[rand(0, 7)];
      const taskTypeValues = Object.values(TASK_TYPE);
      const actionTypeValues = Object.values(ACTION_TYPE);

      target.equipment = equipment;
      target.loc_x = rand(1, 3);
      target.loc_y = rand(1, 8);
      target.loc_z = rand(1, 4);
      target.speed = rand(0, 100);
      target.status = OPERATION_STATUS.START;
      target.standard_type = standardType;
      target.st_count = rand(0, 4);
      target.task_type = taskTypeValues[rand(0, taskTypeValues.length-1)] as TASK_TYPE;
      target.create_date = getRandomDateWithinLastTwoMonths();
      target.loaded = rand(0, 1) === 1;
      target.action_type = actionTypeValues[rand(0, actionTypeValues.length-1)] as ACTION_TYPE;
      
      if (equipment.equipment_type.name === 'STC') {
        const random = rand(0, 1);
        if (random === 0) {
          target.twin_status = TWIN_STATUS.LEFT;
        } else {
          target.twin_status = TWIN_STATUS.RIGHT;
        }
      } else {
        target.twin_status = TWIN_STATUS.DEFAULT;
      }

      targetList.push(target);
    }

    await this.repository.save(targetList);
    this.logger.log('Debug data inserted!');
  }
}
