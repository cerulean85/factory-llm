import { Logger, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ISeeder } from '../../seed.interface';
import { CraneCell } from 'src/domains/__archived__/crane-cell/entities/crane-cell.entity';
import { rand } from 'src/utils/dummy.util';
import { CELL_STATUS } from 'src/common/enum/cell.enum';
import { Equipment } from 'src/domains/equipment/equipment/entities/equipment.entity';

@Injectable()
export class CraneCellSeed implements ISeeder {
    private readonly logger = new Logger(CraneCellSeed.name)
    constructor(
    @InjectRepository(CraneCell)
    private readonly craneCellRepository: Repository<CraneCell>,
    @InjectRepository(Equipment)
    private readonly equipmentRepository: Repository<Equipment>,
  ) {}

  async setupInitialData(insertDebugData : boolean): Promise<void> {
    const cnt = await this.craneCellRepository.count();
    if (cnt === 0 ){
      await this.insertDefaultData();
      if(insertDebugData) {
        await this.insertTestData();
      }
    }
  }

  async insertDefaultData(): Promise<void> {}
  async insertTestData(): Promise<void> {
    this.logger.log('No craneCell found, inserting debug data...');
    const data: Partial<CraneCell>[] = []; // 배열 초기화
    const equipment = await this.equipmentRepository.find()
    
    for (let bank = 1; bank <= 5; bank++) {
      for (let bay = 1; bay <= 5; bay++) {
        for (let level = 1; level <= 8; level++) {

          let cellStatus: CELL_STATUS;
          const cellStatusRandom = rand(0, 3);
          if (cellStatusRandom === 0) {
            cellStatus = CELL_STATUS.IN;
          } else {
            cellStatus = CELL_STATUS.NORMAL;
          }

          data.push({
            bank,
            bay,
            level,
            enable: true,
            cell_status: cellStatus,
            equipment: equipment[rand(14, 23)]!,
          });
        }
      }
    }

    await this.craneCellRepository.insert(data);
    this.logger.log('Debug data inserted!');
  }
}
