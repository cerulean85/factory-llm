import { Module } from '@nestjs/common';
// import { SimulatorService } from './simulator.service';
import { PalletModule } from 'src/domains/storage/pallet/pallet.module';
import { AlarmModule } from 'src/domains/alarm/alarm/alarm.module';
import { AlarmQueueModule } from 'src/collector-interface/queue/alarm-queue/alarm-queue.module';
import { StoredItemModule } from 'src/domains/__archived__/item/stored_item/stored-item.module';
import { EquipmentModule } from 'src/domains/equipment/equipment/equipment.module';
import { CellViewModule } from 'src/collector-interface/view/cell-view/cell-view.module';

@Module({
  imports: [
    SimulatorModule,
    PalletModule,
    AlarmModule,
    AlarmQueueModule,
    StoredItemModule,
    EquipmentModule,
    CellViewModule,
],
  // providers: [SimulatorService],
  // exports: [SimulatorService]
})
export class SimulatorModule {}