import { Logger, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ISeeder } from '../../../seeds/seed.interface';
import { StoredItem } from 'src/domains/__archived__/item/stored_item/entities/stored-item.entity';
import { rand, stdTypes } from '../../../utils/dummy.util'
import { getRandomDateWithinLastTwoMonths } from '../../../utils/dummy.util';

@Injectable()
export class StoredItemSeed implements ISeeder {
  private readonly logger = new Logger(StoredItemSeed.name)
  constructor(
  @InjectRepository(StoredItem)
  private readonly storedItemRepository: Repository<StoredItem>,

  ) {}

  async setupInitialData(insertDebugData : boolean): Promise<void> {
    const cnt = await this.storedItemRepository.count();
    if (cnt === 0 ){
      await this.insertDefaultData();
      if(insertDebugData) {
        await this.insertTestData();
      }
    }
  }

  async insertDefaultData(): Promise<void> {}
  async insertTestData(): Promise<void> {
    const cnt = await this.storedItemRepository.count();

    if (cnt === 0) {
      this.logger.log('No StoredItem found, inserting debug data...');

      const data: Partial<StoredItem>[] = []; // 배열 초기화
      const maxCount = rand(800, 1000); // 개수 랜덤 설정

      for (let count = 0; count < maxCount; count++) {
        let shippingStatus;
        const standardType = stdTypes[rand(0, 7)];
        const createDate = getRandomDateWithinLastTwoMonths();
        const now = new Date();
        const timeDiff = now.getTime() - createDate.getTime();
        const randomOffset = Math.random() * timeDiff; // 0 ~ timeDiff 사이 랜덤
        const updateDate = new Date(createDate.getTime() + randomOffset);
        const detail = `test_${count}`;
        
        // 타임스탬프 기반 고유 sku_id 생성 함수
        const generateUniqueSkuId = (): string => {
          const randomNum = rand(0, 9999);
          return `item_sku_${createDate.getTime()}_${randomNum.toString().padStart(4, '0')}`;
        };
        const skuId = generateUniqueSkuId();

        const shippingRandom = rand(0, 3);
        if (shippingRandom === 0) {
          shippingStatus = false;
        } else {
          shippingStatus = true;
        }
        
        data.push({
          standard_type: standardType,
          detail: detail,
          create_date: createDate,
          update_date: updateDate,
          sku_id: skuId,
        });
      }
      
      data.sort((a, b) => a.create_date!.getTime() - b.create_date!.getTime());
      await this.storedItemRepository.insert(data);
      this.logger.log('Debug data inserted!');
    }
  }
}
