import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobHistory } from './entities/job-history.entity';
import { JobHistoryService } from './job-history.service';
import { JobHistoryRepository } from './repositories/job-history.repository';
import { Pagination } from 'src/utils/pagination.util';
import { PalletModule } from '../pallet/pallet.module';
import { JobHistoryController } from './job-history.controller';
import { GantryJobHistoryController } from './gantry-job-history.controller';
import { GantryJobHistoryService } from './gantry-job-history.service';
import { CraneJobHistoryController } from './crane-job-history.controller';
import { CraneJobHistoryService } from './crane-job-history.service';
import { WarehouseModule } from '../warehouse/warehouse.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([JobHistory]),
    WarehouseModule,
    PalletModule,
  ],
  controllers: [JobHistoryController, GantryJobHistoryController, CraneJobHistoryController],
  providers: [JobHistoryService, GantryJobHistoryService, CraneJobHistoryService, JobHistoryRepository, Pagination],
  exports: [JobHistoryService, GantryJobHistoryService, CraneJobHistoryService]
})
export class JobHistoryModule {}