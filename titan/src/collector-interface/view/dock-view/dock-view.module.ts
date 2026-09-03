import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DockView } from './entities/dock-view.entity';
import { DockViewService } from './dock-view.service';
import { DockViewController } from './dock-view.controller';
import { DockViewRepository } from './repositories/dock-view.repository';
import { Pagination } from 'src/utils/pagination.util';

@Module({
  imports: [
    TypeOrmModule.forFeature([DockView]),
  ],
  controllers: [DockViewController],
  providers: [DockViewRepository, DockViewService, Pagination],
  exports: [DockViewService]
})
export class DockViewModule {}