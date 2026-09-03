import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CraneCell } from './entities/crane-cell.entity';
import { CraneCellService } from './crane-cell.service';
import { CraneCellRepository } from './repositories/crane-cell.repository';
import { Pagination } from 'src/utils/pagination.util';
import { EquipmentModule } from 'src/domains/equipment/equipment/equipment.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CraneCell]),
    EquipmentModule,
  ],
  providers: [CraneCellService, CraneCellRepository, Pagination],
  exports: [CraneCellService]
})
export class CraneCellModule {}