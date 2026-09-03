import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GantryCell } from './entities/gantry-cell.entity';
import { GantryCellService } from './gantry-cell.service';
import { GantryCellRepository } from './repositories/gantry-cell.repository';
import { Pagination } from 'src/utils/pagination.util';
import { EquipmentModule } from 'src/domains/equipment/equipment/equipment.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([GantryCell]),
    EquipmentModule,
  ],
  providers: [GantryCellService, GantryCellRepository, Pagination],
  exports: [GantryCellService]
})
export class GantryCellModule {}