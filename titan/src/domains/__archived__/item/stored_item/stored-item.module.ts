import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoredItem } from './entities/stored-item.entity';
import { StoredItemService } from './stored-item.service';
import { StoredItemRepository } from './repositories/stored-item.repository';
import { Pagination } from 'src/utils/pagination.util';

@Module({
  imports: [
    TypeOrmModule.forFeature([StoredItem]),
  ],
  providers: [StoredItemService, StoredItemRepository, Pagination],
  exports: [StoredItemService]
})
export class StoredItemModule {}