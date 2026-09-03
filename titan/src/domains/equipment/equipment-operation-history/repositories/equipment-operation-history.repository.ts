import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { EquipmentOperationHistory } from '../entities/equipment-operation-history.entity';
import { Equipment } from 'src/domains/equipment/equipment/entities/equipment.entity';
import { CreateEquipmentOperationHistoryDto } from '../dto/request/create-equipment-operation-history.dto';
import { PaginationResponseDto } from 'src/common/dto/pagination-response.dto';
import { Pagination } from 'src/utils/pagination.util';
import { FilteringEquipmentOperationHistoryDto } from '../dto/request/filtering-equipment-operation-history.dto';
import { ORDER } from 'src/common/enum/db.enum';
import { UpdateEquipmentOperationHistoryDto } from '../dto/request/update-equipment-operation-history.dto';
import { EquipmentOperationHistoryBaseRepository, IEquipmentOperationHistoryQueryOptions } from './equipment-operation-history.base.repository';

@Injectable()
export class EquipmentOperationHistoryRepository extends EquipmentOperationHistoryBaseRepository {
  constructor(
    @InjectRepository(EquipmentOperationHistory)
    repository: Repository<EquipmentOperationHistory>,
    pagination: Pagination,
  ) {super(repository, pagination)}

  async createEquipmentOperationHistory(equipment: Equipment, dto: CreateEquipmentOperationHistoryDto): Promise<EquipmentOperationHistory> {
    const newEquipmentOperationHistory = this.repository.create({
      equipment: equipment,
      ...dto,
    });
    const result = await this.repository.save(newEquipmentOperationHistory);
    return result;
  }

  async updateEquipmentOperationHistory(equipmentOperationHistory: EquipmentOperationHistory, dto: UpdateEquipmentOperationHistoryDto): Promise<boolean> {
    const result = await this.repository.update(
      { id: equipmentOperationHistory.id },
      { ...dto }
    );
    return result.affected !== undefined && result.affected > 0;
  }
};