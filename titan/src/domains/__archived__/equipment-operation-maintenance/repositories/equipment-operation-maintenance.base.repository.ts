import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { EquipmentOperationMaintenance } from '../entities/equipment-operation-maintenance.entity';
import { Pagination } from 'src/utils/pagination.util';
import { ORDER } from 'src/common/enum/db.enum';
import { FilteringEquipmentOperationMaintenanceDto } from '../dto/request/filtering-equipment-operation-maintenance.dto';
import { BaseRepositoryContract } from 'src/common/repository/base-repository-contract';

export interface IEquipmentOperationMaintenanceQueryOptions {
  filter?: FilteringEquipmentOperationMaintenanceDto;
  joinEquipment?: boolean;
  orderMap?: Partial<Record<EquipmentOperationMaintenanceOrderKey, ORDER>>;
}


export enum EquipmentOperationMaintenanceOrderKey{
  ID = 'equipment_operation_maintenance.id',
  CREATE_DATE = 'equipment_operation_maintenance.create_date'
}

@Injectable()
export class EquipmentOperationMaintenanceBaseRepository extends BaseRepositoryContract<EquipmentOperationMaintenance, IEquipmentOperationMaintenanceQueryOptions> {
  constructor(
    @InjectRepository(EquipmentOperationMaintenance)
    protected readonly repository: Repository<EquipmentOperationMaintenance>,
    protected readonly pagination: Pagination,
  ) {super(repository, pagination);}

  protected initializeDefaultOptions(
    options: IEquipmentOperationMaintenanceQueryOptions= {}
  ): Required<IEquipmentOperationMaintenanceQueryOptions> {
    return {
      filter: options.filter ?? new FilteringEquipmentOperationMaintenanceDto(),
      joinEquipment: options.joinEquipment ?? true,
      orderMap: options.orderMap ?? {},
    };
  }

  protected createQueryBuilder(
    options: IEquipmentOperationMaintenanceQueryOptions
  ): SelectQueryBuilder<EquipmentOperationMaintenance> {
    const {filter, joinEquipment, orderMap} = this.initializeDefaultOptions(options);
    const queryBuilder = this.createJoinQueryBuilder(joinEquipment);
    const filterQb = this.makeFilteredQueryBuilder(queryBuilder, filter);
    const orderQb = this.makeOrderedQueryBuilder(filterQb, orderMap);

    return orderQb;
  }

  protected createJoinQueryBuilder(joinEquipment: boolean = true): SelectQueryBuilder<EquipmentOperationMaintenance> {
    const queryBuilder = this.repository.createQueryBuilder('equipment_operation_maintenance')
    if (joinEquipment) {
      queryBuilder
        .leftJoinAndSelect('equipment_operation_maintenance.equipment', 'equipment')
        .leftJoinAndSelect('equipment.equipment_type', 'equipment_type')
    }

    queryBuilder
    .select([
      'equipment_operation_maintenance.id',
      'equipment_operation_maintenance.start_date',
      'equipment_operation_maintenance.end_date',
      'equipment_operation_maintenance.operation_maintenance_type',
      'equipment_operation_maintenance.description',
      'equipment_operation_maintenance.create_date',

      ...(joinEquipment ? [
        'equipment.id',
        'equipment.name',
        'equipment_type.id',
        'equipment_type.name',
      ] : []),
    ]);
    return queryBuilder;
  }

  protected makeFilteredQueryBuilder(
    queryBuilder: SelectQueryBuilder<EquipmentOperationMaintenance>,
    filter: FilteringEquipmentOperationMaintenanceDto,
  ): SelectQueryBuilder<EquipmentOperationMaintenance> {
    if (filter.startDate && filter.endDate) {
      queryBuilder.andWhere('equipment_operation_maintenance.start_date >= :startDate', { startDate: filter.startDate })
        .andWhere('equipment_operation_maintenance.end_date <= :endDate', { endDate: filter.endDate });
    } else if (filter.startDate) {
      queryBuilder.andWhere('equipment_operation_maintenance.start_date >= :startDate', { startDate: filter.startDate });
    } else if (filter.endDate) {
      queryBuilder.andWhere('equipment_operation_maintenance.end_date <= :endDate', { endDate: filter.endDate });
    }

    if (filter.operationMaintenanceType) {
      queryBuilder.andWhere('equipment_operation_maintenance.operation_maintenance_type = :operationMaintenanceType', { operationMaintenanceType: filter.operationMaintenanceType });
    }
    if (filter.equipmentId && filter.equipmentId > 0) {
      queryBuilder.andWhere('equipment_operation_maintenance.equipment.id = :equipmentId', { equipmentId: filter.equipmentId });
    }
    if (filter.equipmentOperationMaintenanceId && filter.equipmentOperationMaintenanceId > 0) {
      queryBuilder.andWhere('equipment_operation_maintenance.id = :equipmentOperationMaintenanceId', { equipmentOperationMaintenanceId: filter.equipmentOperationMaintenanceId });
    }

    return queryBuilder;
  }
};