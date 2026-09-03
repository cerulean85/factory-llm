import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShippingSpecification } from './entities/shipping-specification.entity';
import { ShippingSpecificationRepository } from './repositories/shipping-specification.repository';
import { ShippingSpecificationService } from './shipping-specification.service';

import { UsersModule } from '../../users/users/users.module';
import { ShippingSpecificationController } from './shipping-specification.controller';
import { Pagination } from 'src/utils/pagination.util';
import { JobHistoryModule } from '../job-history/job-history.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ShippingSpecification]),
    UsersModule,
    JobHistoryModule,
],
  controllers: [ShippingSpecificationController],
  providers: [ShippingSpecificationService, ShippingSpecificationRepository, Pagination],
  exports: [ShippingSpecificationService]
})
export class ShippingSpecificationModule {}