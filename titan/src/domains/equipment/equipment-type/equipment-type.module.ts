import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EquipmentType } from './entities/equipment-type.entity';
import { EquipmentTypeRepository } from './repositories/equipment-type.repository';
import { EquipmentTypeService } from './equipment-type.service';
import { EquipmentTypeController } from './equipment-type.controller';
import { Pagination } from 'src/utils/pagination.util';

@Module({
  imports: [
    TypeOrmModule.forFeature([EquipmentType]),
],
  controllers: [EquipmentTypeController],
  providers: [EquipmentTypeService, EquipmentTypeRepository, Pagination],
  exports: [EquipmentTypeService, EquipmentTypeRepository]
})
export class EquipmentTypeModule {}