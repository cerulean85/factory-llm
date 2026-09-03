import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EquipmentOperationMaintenanceService } from './equipment-operation-maintenance.service';
import { EquipmentOperationMaintenanceController } from './equipment-operation-maintenance.controller';
import { EquipmentModule } from '../../equipment/equipment/equipment.module';
import { Pagination } from 'src/utils/pagination.util';
import { EquipmentOperationMaintenance } from './entities/equipment-operation-maintenance.entity';
import { EquipmentOperationMaintenanceRepository } from './repositories/equipment-operation-maintenance.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([EquipmentOperationMaintenance]),
    EquipmentModule
],
  controllers: [EquipmentOperationMaintenanceController],
  providers: [EquipmentOperationMaintenanceRepository, EquipmentOperationMaintenanceService, Pagination],
  exports: [EquipmentOperationMaintenanceService]
})
export class EquipmentOperationMaintenanceModule {}
