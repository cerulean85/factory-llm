import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemMasterView } from './entities/item-master-view.entity';
import { ItemMasterViewService } from './item-master-view.service';
import { ItemMasterViewController } from './item-master-view.controller';
import { ItemMasterViewRepository } from './repositories/item-master-view.repository';
import { Pagination } from 'src/utils/pagination.util';

@Module({
  imports: [
    TypeOrmModule.forFeature([ItemMasterView]),
  ],
  controllers: [ItemMasterViewController],
  providers: [ItemMasterViewRepository, ItemMasterViewService, Pagination],
  exports: [ItemMasterViewService]
})
export class ItemMasterViewModule {}