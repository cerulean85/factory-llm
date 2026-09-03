import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { EquipmentOperationHistory } from '../entities/equipment-operation-history.entity';
import { Pagination } from 'src/utils/pagination.util';
import { FilteringEquipmentOperationHistoryDto } from '../dto/request/filtering-equipment-operation-history.dto';
import { ORDER } from 'src/common/enum/db.enum';
import { BaseRepositoryContract } from 'src/common/repository/base-repository-contract';
import { makeQuerybuilderToSql } from 'src/utils/database.util';

export interface IEquipmentOperationHistoryQueryOptions {
  filter?: FilteringEquipmentOperationHistoryDto;
  joinEquipment?: boolean;
  orderMap?: Partial<Record<EquipmentOperationHistoryOrderKey, ORDER>>;
}

export enum EquipmentOperationHistoryOrderKey{
  ID = 'equipment_operation_history.id',
  CREATE_DATE = 'equipment_operation_history.create_date'
}

@Injectable()
export class EquipmentOperationHistoryBaseRepository extends BaseRepositoryContract<EquipmentOperationHistory, IEquipmentOperationHistoryQueryOptions> {
  constructor(
    @InjectRepository(EquipmentOperationHistory)
    protected readonly repository: Repository<EquipmentOperationHistory>,
    protected readonly pagination: Pagination,
  ) {super(repository, pagination)}

  protected initializeDefaultOptions(
    options: IEquipmentOperationHistoryQueryOptions= {}
  ): Required<IEquipmentOperationHistoryQueryOptions> {
    return {
      filter: options.filter ?? new FilteringEquipmentOperationHistoryDto(),
      joinEquipment: options.joinEquipment ?? true,
      orderMap: options.orderMap ?? {},
    };
  }

  protected createQueryBuilder(
    options: IEquipmentOperationHistoryQueryOptions
  ): SelectQueryBuilder<EquipmentOperationHistory> {
    const {filter, joinEquipment, orderMap} = this.initializeDefaultOptions(options);
    const queryBuilder = this.createJoinQueryBuilder(joinEquipment);
    const filterQb = this.makeFilteredQueryBuilder(queryBuilder, filter);
    const orderQb = this.makeOrderedQueryBuilder(filterQb, orderMap)
    return orderQb;
  }

  protected createJoinQueryBuilder(joinEquipment: boolean = true): SelectQueryBuilder<EquipmentOperationHistory> {
    const queryBuilder = this.repository.createQueryBuilder('equipment_operation_history')
    if (joinEquipment) {
      queryBuilder
        .leftJoinAndSelect('equipment_operation_history.equipment', 'equipment')
        .leftJoinAndSelect('equipment.equipment_type', 'equipment_type')
    }

    queryBuilder
    .select([
      'equipment_operation_history.id',
      'equipment_operation_history.create_date',
      'equipment_operation_history.operation_status',
      'equipment_operation_history.description',
      'equipment_operation_history.operation_maintenance_type',

      ...(joinEquipment ? [
        'equipment.id',
        'equipment.name',
        'equipment.code',
        'equipment_type.id',
        'equipment_type.name',
        'equipment_type.type',
      ] : []),
    ]);
    return queryBuilder;
  }

  protected makeFilteredQueryBuilder(
    queryBuilder: SelectQueryBuilder<EquipmentOperationHistory>,
    filter: FilteringEquipmentOperationHistoryDto,
  ): SelectQueryBuilder<EquipmentOperationHistory> {
    if (filter.startDate && filter.endDate) {
      queryBuilder.andWhere('equipment_operation_history.create_date >= :startDate', { startDate: filter.startDate })
        .andWhere('equipment_operation_history.create_date <= :endDate', { endDate: filter.endDate });
    } else if (filter.startDate) {
      queryBuilder.andWhere('equipment_operation_history.create_date >= :startDate', { startDate: filter.startDate });
    } else if (filter.endDate) {
      queryBuilder.andWhere('equipment_operation_history.create_date <= :endDate', { endDate: filter.endDate });
    }

    if (filter.operationStatus) {
      queryBuilder.andWhere('equipment_operation_history.operation_status = :operationStatus', { operationStatus: filter.operationStatus });
    }
    if (filter.equipmentId && filter.equipmentId > 0) {
      queryBuilder.andWhere('equipment_operation_history.equipment.id = :equipmentId', { equipmentId: filter.equipmentId });
    }
    if (filter.equipmentOperationHistoryId && filter.equipmentOperationHistoryId > 0) {
      queryBuilder.andWhere('equipment_operation_history.id = :equipmentOperationHistoryId', { equipmentOperationHistoryId: filter.equipmentOperationHistoryId });
    }
    if (filter.equipmentType) {
      queryBuilder.andWhere('equipment_type.type IN (:...equipmentType)', { equipmentType: filter.equipmentType });
    }
    return queryBuilder;
  }
};