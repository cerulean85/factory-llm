import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RealtimeWarehouseView } from './entities/realtime-warehouse-view.entity';
import { RealtimeWarehouseViewRepository } from './repositories/realtime-warehouse-view.repository';
import { RealtimeWarehouseViewService } from './realtime-warehouse-view.service';
import { RealtimeWarehouseViewController } from './reatime-warehouse-view.controller';
import { SseModule } from 'src/core/sse/sse.module';
import { WarehouseModule } from 'src/domains/storage/warehouse/warehouse.module';
import { Pagination } from 'src/utils/pagination.util';

@Module({
  imports: [
    TypeOrmModule.forFeature([RealtimeWarehouseView]),
    SseModule,
    WarehouseModule,
  ],
  controllers: [RealtimeWarehouseViewController],
  providers: [RealtimeWarehouseViewRepository, RealtimeWarehouseViewService, Pagination],
  exports: [RealtimeWarehouseViewService]
})
export class RealtimeWarehouseViewModule {}