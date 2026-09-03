import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RealtimeEquipmentView } from './entities/realtime-equipment-view.entity';
import { RealtimeEquipmentViewService } from './realtime-equipment-view.service';
import { RealtimeEquipmentViewController } from './realtime-equipment-view.controller';
import { RealtimeEquipmentViewRepository } from './repositories/realtime-equipment-view.repository';
import { EquipmentModule } from 'src/domains/equipment/equipment/equipment.module';
import { SseModule } from 'src/core/sse/sse.module';
import { Pagination } from 'src/utils/pagination.util';
import { EquipmentOperationHistoryModule } from 'src/domains/equipment/equipment-operation-history/equipmen-operation-history.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RealtimeEquipmentView]),
    EquipmentModule,
    SseModule,
    EquipmentOperationHistoryModule,
  ],
  controllers: [RealtimeEquipmentViewController],
  providers: [RealtimeEquipmentViewRepository, RealtimeEquipmentViewService, Pagination],
  exports: [RealtimeEquipmentViewService]
})
export class RealtimeEquipmentViewModule {}