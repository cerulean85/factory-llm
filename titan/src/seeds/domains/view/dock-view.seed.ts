import { Logger, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ISeeder } from '../../seed.interface';
import { rand } from '../../../utils/dummy.util'
import { DockView } from 'src/collector-interface/view/dock-view/entities/dock-view.entity';

@Injectable()
export class DockViewSeed implements ISeeder{
    private readonly logger = new Logger(DockViewSeed.name)
    constructor(
    @InjectRepository(DockView)
    private readonly dockViewRepository: Repository<DockView>,
  ) {}

  async setupInitialData(insertDebugData : boolean): Promise<void> {
    const cnt = await this.dockViewRepository.count();
    if (cnt === 0) {
      await this.insertDefaultData();
      if(insertDebugData) {
        await this.insertTestData();
      }
    }
  }

  async insertDefaultData(): Promise<void> {}
  async insertTestData(): Promise<void> {
    this.logger.log('No Dock found, inserting debug data...');
    const statusList = ['Processing', 'Stop'];
    for (let i = 0; i < 10; i++) {
      const dockView = new DockView();
      dockView.id = i + 1;
      dockView.dock_no = rand(1, 100);
      dockView.gantry_code = rand(0, 100);
      dockView.status = statusList[rand(0, 1)];
      dockView.shipment_order = rand(10000, 99999);
      dockView.container_no = `CONTAINER_${rand(1000, 9999)}`;
      dockView.unit_order_count = rand(0, 100);
      dockView.order_count = rand(100, 5000);
      dockView.outing_count = rand(0, 500);
      dockView.in_gantry_count = rand(0, 300);
      dockView.conveyor_count = rand(0, 100);
      dockView.completion_count = rand(0, 1000);
      dockView.remand_count = rand(0, 100);
      dockView.bad_count = rand(0, 100);
      await this.dockViewRepository.save(dockView);
    }
    this.logger.log('Debug data inserted!');
  }
}