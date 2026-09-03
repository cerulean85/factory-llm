import { Logger, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ISeeder } from '../../../seeds/seed.interface';
import { GantryCell } from 'src/domains/__archived__/gantry-cell/entities/gantry-cell.entity';
import { rand } from '../../../utils/dummy.util'
import { getRandomDateWithinLastTwoMonths } from '../../../utils/dummy.util';
import { CELL_STATUS } from 'src/common/enum/cell.enum';
import { Equipment } from 'src/domains/equipment/equipment/entities/equipment.entity';

@Injectable()
export class GantryCellSeed implements ISeeder {
  private readonly logger = new Logger(GantryCellSeed.name)
  constructor(
  @InjectRepository(GantryCell)
  private readonly gantryCellRepository: Repository<GantryCell>,
  @InjectRepository(Equipment)
  private readonly equipmentRepository: Repository<Equipment>,

  ) {}

  async setupInitialData(insertDebugData : boolean): Promise<void> {
    const cnt = await this.gantryCellRepository.count();
    if (cnt === 0 ){
      await this.insertDefaultData();
      if(insertDebugData) {
        await this.insertTestData();
      }
    }
  }

  async insertDefaultData(): Promise<void> {}
  async insertTestData(): Promise<void> {
    const cnt = await this.gantryCellRepository.count();

    if (cnt === 0) {
      this.logger.log('No gantryCell found, inserting debug data...');
      const equipment = await this.equipmentRepository.find();

      const data: Partial<GantryCell>[] = []; // 배열 초기화
      const maxCount = rand(400, 450); // 400~450개 랜덤 설정
      let count = 0;

      for (let port = 5; port <= 8; port++) {
        for (let bank = 1; bank <= 10; bank++) {
          for (let bay = 1; bay <= 10; bay++) {
            
            // 최대 개수에 도달하면 중단
            if (count >= maxCount) break;

            // 일정 확률로 skip (밀도 조절)
            const skip = rand(0, 3);
            if (skip === 0) continue; // 25% 확률로 skip
            const randomDate = getRandomDateWithinLastTwoMonths();

            let cellStatus: CELL_STATUS;
            const cellStatusRandom = rand(0, 3);
            if (cellStatusRandom === 0) {
              cellStatus = CELL_STATUS.IN;
            } else {
              cellStatus = CELL_STATUS.NORMAL;
            }

            data.push({
              port,
              bank,
              bay,
              enable: true,
              equipment: equipment[rand(0, 13)]!,
              create_date: randomDate,
              update_date: randomDate,
              cell_status: cellStatus,
            });
            count++;
          }
          if (count >= maxCount) break;
        }
        if (count >= maxCount) break;
      }
      
      await this.gantryCellRepository.insert(data);
      this.logger.log('Debug data inserted!');
    }
  }
}
