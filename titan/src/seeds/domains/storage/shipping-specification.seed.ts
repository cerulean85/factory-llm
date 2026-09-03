import { Logger, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShippingSpecification } from 'src/domains/storage/shipping-specification/entities/shipping-specification.entity';
import { Users } from 'src/domains/users/users/entities/users.entity';
import { ISeeder } from '../../seed.interface';
import { getRandomDateWithinLastTwoMonths, rand, stdTypes } from '../../../utils/dummy.util'

@Injectable()
export class ShippingSpecificationSeed implements ISeeder{
    private readonly logger = new Logger(ShippingSpecificationSeed.name)
    constructor(
    @InjectRepository(ShippingSpecification)
    private readonly shippingSpecificationRepository: Repository<ShippingSpecification>,
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
  ) {}

  async setupInitialData(insertDebugData : boolean): Promise<void> {
    const cnt = await this.shippingSpecificationRepository.count();
    if (cnt === 0 ){
      await this.insertDefaultData();
      if(insertDebugData) {
        await this.insertTestData();
      }
    }
  }

  async insertDefaultData(): Promise<void> {}
  async insertTestData(): Promise<void> {
    const targets: ShippingSpecification[] = [];
    let usersList = await this.usersRepository.find();
    for (let i = 0; i < 8; i++) {

      const record = new ShippingSpecification();
      const createDate = getRandomDateWithinLastTwoMonths();
      record.create_date = createDate;
      record.valid_record = true;
      record.standard_type = stdTypes[i];
      record.users = usersList[rand(0, usersList.length - 1)];

      const today = new Date();
      const minTime = createDate.getTime();
      const maxTime = today.getTime();
      const endTime = minTime + Math.random() * (maxTime - minTime);
      const endDate = new Date(endTime);
      record.update_date = endDate;

      targets.push(record);
    }

    this.shippingSpecificationRepository.insert(targets);
  }
}