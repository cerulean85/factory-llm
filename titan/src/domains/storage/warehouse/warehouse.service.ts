import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { WarehouseRepository } from './repositories/warehouse.repository';
import { Warehouse } from './entities/warehouse.entity';
import { FilteringWarehouseDto } from './dto/request/filtering-warehouse.dto';

@Injectable()
export class WarehouseService {
  private readonly logger = new Logger(WarehouseService.name)
  constructor(
    private readonly warehouseRepository: WarehouseRepository
  ) {}

  async getAllWarehouse(): Promise<Warehouse[]> {
    const result = await this.warehouseRepository.getFilteredList();
    return result;
  }

  async getWarehouseById(id: number): Promise<Warehouse> {
    const filterDto = new FilteringWarehouseDto();
    filterDto.warehouseId = id;
    const result = await this.warehouseRepository.getFilteredOne({ filter: filterDto });
    if (!result) {
      this.logger.warn(`Warehouse with id ${id} not found`);
      throw new NotFoundException(`Warehouse with id ${id} not found`);
    }
    return result;
  }

  async softDeleteWarehouse(id: number): Promise<boolean> {
    const filterDto = new FilteringWarehouseDto();
    filterDto.warehouseId = id;
    const warehouse = await this.warehouseRepository.getFilteredOne({ filter: filterDto });
    if (!warehouse) {
      this.logger.warn(`Warehouse with id ${id} not found`);
      throw new Error(`Warehouse with id ${id} not found`);
    }

    const result = await this.warehouseRepository.deleteWarehouse(id);
    return result;
  }
};