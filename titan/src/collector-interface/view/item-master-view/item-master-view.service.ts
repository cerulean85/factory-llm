import { Logger, Injectable, NotFoundException } from '@nestjs/common';
import { ItemMasterViewRepository } from './repositories/item-master-view.repository';
import { ItemMasterViewResponseDto } from './dto/response/item-master-view-response.dto';
import { plainToInstance } from 'class-transformer';
import { FilteringItemMasterViewDto } from './dto/request/filtering-item-master-view.dto';
import { ItemMasterView } from './entities/item-master-view.entity';

@Injectable()
export class ItemMasterViewService {
  private readonly logger = new Logger(ItemMasterViewService.name)
  
  constructor(
    private readonly itemMasterViewRepository: ItemMasterViewRepository,
  ) {
  }

  async getItemMasterViewList(filterDto: FilteringItemMasterViewDto): Promise<ItemMasterViewResponseDto[]> {
    const itemMasterViewData = await this.itemMasterViewRepository.getFilteredList({ filter: filterDto });
    const result = plainToInstance(ItemMasterViewResponseDto, itemMasterViewData, { excludeExtraneousValues: true });
    return result;
  }

  async getItemMasterViewBySkuKey(skuKey: string): Promise<ItemMasterViewResponseDto> {
    const filterDto = new FilteringItemMasterViewDto();
    filterDto.skuKey = skuKey;
    const itemMasterViewData = await this.itemMasterViewRepository.getFilteredOne({ filter: filterDto });
    const result = plainToInstance(ItemMasterViewResponseDto, itemMasterViewData, { excludeExtraneousValues: true });
    return result;
  }

  async getItemMasterViewEntityBySkuKey(skuKey: string): Promise<ItemMasterView | null> {
    const filterDto = new FilteringItemMasterViewDto();
    filterDto.skuKey = skuKey;
    const itemMasterViewData = await this.itemMasterViewRepository.getFilteredOne({ filter: filterDto });
    return itemMasterViewData;
  }
}