import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { EquipmentOperationMaintenance } from '../entities/equipment-operation-maintenance.entity';
import { Equipment } from 'src/domains/equipment/equipment/entities/equipment.entity';
import { PaginationResponseDto } from 'src/common/dto/pagination-response.dto';
import { Pagination } from 'src/utils/pagination.util';
import { ORDER } from 'src/common/enum/db.enum';
import { FilteringEquipmentOperationMaintenanceDto } from '../dto/request/filtering-equipment-operation-maintenance.dto';
import { CreateEquipmentOperationMaintenanceDto } from '../dto/request/create-equipment-operation-maintenance.dto';
import { UpdateEquipmentOperationMaintenanceDto } from '../dto/request/update-equipment-operation-maintenance.dto';
import { makeQuerybuilderToSql } from 'src/utils/database.util';
import { EquipmentOperationMaintenanceBaseRepository, IEquipmentOperationMaintenanceQueryOptions } from './equipment-operation-maintenance.base.repository';


@Injectable()
export class EquipmentOperationMaintenanceRepository extends EquipmentOperationMaintenanceBaseRepository {
  constructor(
    @InjectRepository(EquipmentOperationMaintenance)
    repository: Repository<EquipmentOperationMaintenance>,
    pagination: Pagination,
  ) {super(repository, pagination);}

  async createEquipmentOperationMaintenance(equipment: Equipment, dto: CreateEquipmentOperationMaintenanceDto): Promise<EquipmentOperationMaintenance> {
    const newEomHistory = this.repository.create({
      equipment: equipment,
      ...dto,
    });
    const result = await this.repository.save(newEomHistory);
    return result;
  }

  async updateEquipmentOperationMaintenance(eomHistory: EquipmentOperationMaintenance, dto: UpdateEquipmentOperationMaintenanceDto): Promise<boolean> {
    const result = await this.repository.update(
      { id: eomHistory.id },
      { ...dto }
    );
    return result.affected !== undefined && result.affected > 0;
  }
  
};