import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EquipmentOperationHistory } from './entities/equipment-operation-history.entity';
import { EquipmentOperationHistoryRepository } from './repositories/equipment-operation-history.repository';
import { EquipmentOperationHistoryService } from './equipment-operation-history.service';
import { EquipmentOperationHistoryController } from './equipment-operation-history.controller';
import { EquipmentModule } from '../equipment/equipment.module';
import { Pagination } from 'src/utils/pagination.util';
import { Cursor } from 'src/utils/cursor.util';
import { EquipmentOperationHistoryStatsRepository } from './repositories/equipment-operation-history.stats.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([EquipmentOperationHistory]),
    EquipmentModule
],
  controllers: [EquipmentOperationHistoryController],
  providers: [EquipmentOperationHistoryRepository, EquipmentOperationHistoryStatsRepository, 
              EquipmentOperationHistoryService, Pagination, Cursor],
  exports: [EquipmentOperationHistoryService]
})
export class EquipmentOperationHistoryModule {}
