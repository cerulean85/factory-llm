import { Logger, Injectable, NotFoundException } from '@nestjs/common';
import { StoredItemRepository } from './repositories/stored-item.repository';
import { FilteringStoredItemDto } from './dto/filtering-stored-item.dto';
import { StoredItem } from './entities/stored-item.entity';
import { UpdateStoredItemDto } from './dto/update-stored-item.dto';
import { CreateStoredItemDto } from './dto/create-stored-item.dto';

@Injectable()
export class StoredItemService {
    private readonly logger = new Logger(StoredItemService.name)
    constructor(
    private readonly storedItemRepository: StoredItemRepository,
  ) {}

  async getStoredItem(filter : FilteringStoredItemDto = new FilteringStoredItemDto()): Promise<StoredItem[]> {
    const storedItemList = await this.storedItemRepository.getFilteredList({ filter: filter });
    if (!storedItemList) {
      this.logger.warn(`StoredItem not found`);
      throw new NotFoundException(`StoredItem not found`);
    }
    return storedItemList;
  }

  async getStoredItemById(storedItemId: number): Promise<StoredItem> {
    const filterDto = new FilteringStoredItemDto();
    filterDto.storedItemId = storedItemId;
    const storedItem = await this.storedItemRepository.getFilteredOne({ filter: filterDto });
    if (!storedItem) {
      this.logger.warn(`storedItem with ID ${storedItemId} not found`);
      throw new NotFoundException(`storedItem with ID ${storedItemId} not found`);
    }
    const result = storedItem;
    return result;
  }

  async getStoredItemBySkuId(skuId: string): Promise<StoredItem> {
    const filterDto = new FilteringStoredItemDto();
    filterDto.skuId = skuId;
    const storedItem = await this.storedItemRepository.getFilteredOne({ filter: filterDto });
    if (!storedItem) {
      this.logger.warn(`storedItem with SKU ID ${skuId} not found`);
      throw new NotFoundException(`storedItem with SKU ID ${skuId} not found`);
    }
    const result = storedItem;
    return result;
  }

  async updateStoredItem(storedItemId: number, updateDto: UpdateStoredItemDto): Promise<boolean> {
    const result = await this.storedItemRepository.updateStoredItem(storedItemId, updateDto);
    return result
  }

  async createStoredItem(createDto: CreateStoredItemDto): Promise<StoredItem>{
    const result = await this.storedItemRepository.createStoredItem(createDto);
    return result;
  }
}