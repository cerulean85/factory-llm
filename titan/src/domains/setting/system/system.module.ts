import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { System } from './entities/system.entity';
import { SystemRepository } from './respositories/system.repository';
import { SystemService } from './system.service';
import { SystemController } from './system.controller';
import { Pagination } from 'src/utils/pagination.util';
import { WarehouseModule } from 'src/domains/storage/warehouse/warehouse.module';
import { SseModule } from 'src/core/sse/sse.module';

@Module({
  imports: [TypeOrmModule.forFeature([System]), WarehouseModule, SseModule],
  controllers: [SystemController],
  providers: [SystemService, SystemRepository, Pagination],
  exports: [SystemService],
})
export class SystemModule {}
