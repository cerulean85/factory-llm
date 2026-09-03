import { Logger, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ISeeder } from '../../seed.interface';
import { rand, stdTypes } from '../../../utils/dummy.util'
import { getRandomDateWithinLastYear } from '../../../utils/dummy.util';
import { TASK_TYPE, WAREHOUSE_TYPE } from 'src/common/enum/equipment.enum';
import { JobHistory } from 'src/domains/storage/job-history/entities/job-history.entity';
import { Pallet } from 'src/domains/storage/pallet/entities/pallet.entity';
import { WORKING_STATUS } from 'src/common/enum/equipment.enum';
import { Warehouse } from 'src/domains/storage/warehouse/entities/warehouse.entity';

@Injectable()
export class JobHistorySeed implements ISeeder{
    private readonly logger = new Logger(JobHistorySeed.name)
    constructor(
    @InjectRepository(JobHistory)
    private readonly jobHistoryRepository: Repository<JobHistory>,
    @InjectRepository(Pallet)
    private readonly palletRepository: Repository<Pallet>,
    @InjectRepository(Warehouse)
    private readonly warehouseRepository: Repository<Warehouse>,
  ) {}

  async setupInitialData(insertDebugData : boolean): Promise<void> {
    const cnt = await this.jobHistoryRepository.count();
    if (cnt === 0) {
      await this.insertDefaultData();
      if(insertDebugData) {
        await this.insertTestData();
      }
    }
  }


  async insertCraneData(): Promise<JobHistory[]> {
    const palletList = await this.palletRepository.find();
    if (palletList.length === 0) return [];
    const targets: JobHistory[] = [];
    const warehouse = await this.warehouseRepository.find({ where: { type: WAREHOUSE_TYPE.CRANE } });

    for (let count = 0; count < 3000; count++) {
      const selectedPallet = palletList[rand(0, palletList.length - 1)];
      const randomTime = getRandomDateWithinLastYear();

      const skuKey = `Key${rand(1000000000, 9999999999)}`;
      const standardType = stdTypes[rand(0, 7)];
      const batchNumber = `${rand(100000, 999999)}`;
      const orderNumber = `${rand(100000, 999999)}`;
      const orderFlow = `${rand(100000, 999999)}`;

      const stCount = rand(10, 100);
      const taskType = Object.values(TASK_TYPE)[rand(0, Object.values(TASK_TYPE).length - 1)];
      if (taskType === TASK_TYPE.NONE) continue;
      const locRaw = `${rand(0,50).toString().padStart(2, '0')}${rand(0,50).toString().padStart(2, '0')}${rand(0,50).toString().padStart(2, '0')}`;

      const data = new JobHistory();
      data.pallet = selectedPallet;
      data.warehouse = warehouse[rand(0, warehouse.length - 1)];
      data.sku_key = skuKey;
      data.standard_type = standardType;
      data.working_status = WORKING_STATUS.COMPLETE;
      data.st_count = stCount;
      data.loc_raw = locRaw;
      data.task_type = taskType;
      data.batch_number = batchNumber;
      data.order_number = orderNumber;
      data.order_flow = orderFlow;
      data.job_date = randomTime;
      data.create_date = randomTime;

      targets.push(data);

      if ((taskType === TASK_TYPE.INPUT || taskType === TASK_TYPE.OUTPUT) && rand(0,3) === 3) {
        const randomTime2 = this.getRandomDateAfter(randomTime)
        const data2 = new JobHistory();
        data2.pallet = selectedPallet;
        data2.warehouse = warehouse[rand(0, warehouse.length - 1)];
        data2.sku_key = skuKey;
        data2.standard_type = standardType;
        data2.working_status = WORKING_STATUS.CANCEL;
        data2.st_count = stCount - rand(1, stCount - 1);
        data2.loc_raw = locRaw;
        data2.task_type = taskType;
        data2.batch_number = batchNumber;
        data2.order_number = orderNumber;
        data2.order_flow = orderFlow;
        data2.job_date = randomTime2;
        data2.create_date = randomTime2;

        targets.push(data2);
      }
    }

    return targets;
  }

  async insertGantryData(): Promise<JobHistory[]> {
    const targets: JobHistory[] = [];
    const warehouse = await this.warehouseRepository.find({ where: { type: WAREHOUSE_TYPE.GANTRY } });


    for (let count = 0; count < 3000; count++) {
      const randomTime = getRandomDateWithinLastYear();
      const stCount = rand(10, 100);
      const taskType = Object.values(TASK_TYPE)[rand(0, Object.values(TASK_TYPE).length - 1)];
      if (taskType === TASK_TYPE.NONE) continue;
      const skuKey = `Key${rand(1000000000, 9999999999)}`;
      const standardType = stdTypes[rand(0, 7)];
      const batchNumber = `${rand(100000, 999999)}`;
      const orderNumber = `${rand(100000, 999999)}`;
      const orderFlow = `${rand(100000, 999999)}`;
      const locRaw = `0000${rand(0,200).toString().padStart(3, '0')}`;

      const data = new JobHistory();
      data.pallet = null;
      data.warehouse = warehouse[rand(0, warehouse.length - 1)];
      data.sku_key = skuKey;
      data.standard_type = standardType;
      data.working_status = WORKING_STATUS.COMPLETE;
      data.st_count = stCount;
      data.loc_raw = locRaw;
      data.task_type = taskType;
      data.batch_number = batchNumber;
      data.order_number = orderNumber;
      data.order_flow = orderFlow;
      data.job_date = randomTime;
      data.create_date = randomTime;

      targets.push(data);

      if ((taskType === TASK_TYPE.INPUT || taskType === TASK_TYPE.OUTPUT) && rand(0,3) === 3) {
        const randomTime2 = this.getRandomDateAfter(randomTime);
        const data2 = new JobHistory();
        data2.pallet = null;
        data2.warehouse = warehouse[rand(0, warehouse.length - 1)];
        data2.sku_key = skuKey;
        data2.standard_type = standardType;
        data2.working_status = WORKING_STATUS.CANCEL;
        data2.st_count = stCount - rand(1, stCount - 1);
        data2.loc_raw = locRaw;
        data2.task_type = taskType;
        data2.batch_number = batchNumber;
        data2.order_number = orderNumber;
        data2.order_flow = orderFlow;
        data2.job_date = randomTime2;
        data2.create_date = randomTime2;

        targets.push(data2);
      }
    }

    return targets;
  }

  private getRandomDateAfter(baseDate: Date, minDays: number = 1, maxDays: number = 3): Date {
    const daysToAdd = rand(minDays, maxDays);
    const newDate = new Date(baseDate);
    newDate.setDate(newDate.getDate() + daysToAdd);
    return newDate;
  }


  async insertDefaultData(): Promise<void> {}
  async insertTestData(): Promise<void> {
    const cnt = await this.jobHistoryRepository.count();
    if (cnt === 0) {
      this.logger.log('No JobHistory found, inserting debug data...');

      const craneData = await this.insertCraneData();
      const gantryData = await this.insertGantryData();
      const allData = [...craneData, ...gantryData];
      
      // 날짜순으로 정렬
      allData.sort((a, b) => a.job_date!.getTime() - b.job_date!.getTime());
      
      // 배치 크기로 나누어서 삽입 (한 번에 너무 많은 데이터를 삽입하지 않도록)
      const batchSize = 100;
      for (let i = 0; i < allData.length; i += batchSize) {
        const batch = allData.slice(i, i + batchSize);
        await this.jobHistoryRepository.save(batch);
      }
      
      this.logger.log('Debug data inserted!');
    }
  }
}
