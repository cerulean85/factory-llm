import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Warehouse } from './entities/warehouse.entity';
import { WarehouseRepository } from './repositories/warehouse.repository';
import { WarehouseService } from './warehouse.service';
import { WarehouseController } from './warehouse.controller';
import { Pagination } from 'src/utils/pagination.util';

@Module({
  imports: [
    TypeOrmModule.forFeature([Warehouse])
  ],
  controllers: [WarehouseController],
  providers: [WarehouseService, WarehouseRepository, Pagination],
  exports: [WarehouseService]
})
export class WarehouseModule {}
