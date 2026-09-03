import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Equipment } from './entities/equipment.entity';
import { EquipmentRepository } from './repositories/equipment.repository';
import { EquipmentService } from './equipment.service';
import { EquipmentController } from './equipment.controller';
import { Pagination } from 'src/utils/pagination.util';
import { EquipmentTypeModule } from '../equipment-type/equipment-type.module';
import { WarehouseModule } from 'src/domains/storage/warehouse/warehouse.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Equipment]),
    EquipmentTypeModule,
    WarehouseModule,
],
  controllers: [EquipmentController],
  providers: [EquipmentService, EquipmentRepository, Pagination],
  exports: [EquipmentService]
})
export class EquipmentModule {}