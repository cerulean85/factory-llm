import { Logger, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ISeeder } from '../../seed.interface';
import { getRandomDateWithinLastTwoMonths } from '../../../utils/dummy.util'
import { Pallet } from 'src/domains/storage/pallet/entities/pallet.entity';

@Injectable()
export class PalletSeed implements ISeeder{
    private readonly logger = new Logger(PalletSeed.name)
    constructor(
    @InjectRepository(Pallet)
    private readonly palletRepository: Repository<Pallet>,
  ) {}

  async setupInitialData(insertDebugData : boolean): Promise<void> {
    const cnt = await this.palletRepository.count();
    if (cnt === 0 ){
      await this.insertDefaultData();
      if(insertDebugData) {
        await this.insertTestData();
      }
    }
  }

  async insertDefaultData(): Promise<void> {
    const cnt = await this.palletRepository.count();

    if (cnt === 0) {
      this.logger.log('No Pallet found, inserting debug data...');
      const targets: Pallet[] = [];

      for (let i = 0; i < 35000; i++) {
      const newDate = new Date();
      const record = new Pallet();
      record.create_date = newDate;
      record.update_date = newDate; 
      const paddedNum = (i + 1).toString().padStart(6, "0");
      record.code = `JB${paddedNum}`;
      targets.push(record);
      }

    const BATCH_SIZE = 1000;

      for (let i = 0; i < targets.length; i += BATCH_SIZE) {
        const batch = targets.slice(i, i + BATCH_SIZE);
        await this.palletRepository.insert(batch);
      }
    }
  }

  async insertTestData(): Promise<void> {
    // const cnt = await this.palletRepository.count();

    // if (cnt === 0) {
    //   this.logger.log('No Pallet found, inserting debug data...');
    //   const targets: Pallet[] = [];

    //   for (let i = 0; i < 35000; i++) {
    //   //const randomDate = getRandomDateWithinLastTwoMonths();
    //   const record = new Pallet();
    //   record.create_date = randomDate;
    //   record.update_date = randomDate;
    //   record.code = `pallet_${i + 1}`;

    //   targets.push(record);
    //   }
    // await this.palletRepository.insert(targets);
    // }
  }
}