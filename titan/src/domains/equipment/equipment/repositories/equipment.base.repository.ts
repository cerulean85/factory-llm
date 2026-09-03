import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Equipment } from '../entities/equipment.entity';
import { FilteringEquipmentDto } from '../dto/request/filtering-equipment.dto';
import { ORDER } from 'src/common/enum/db.enum';
import { Pagination } from 'src/utils/pagination.util';
import { BaseRepositoryContract } from 'src/common/repository/base-repository-contract';

export interface IEquipmentQueryOptions {
  filter?: FilteringEquipmentDto;
  joinEquipmentType?: boolean;
  joinWarehouse?: boolean;
  orderMap?: Partial<Record<EquipmentOrderKey, ORDER>>;
}

export enum EquipmentOrderKey{
  ID = 'equipment.id',
}

@Injectable()
export class EquipmentBaseRepository extends BaseRepositoryContract<Equipment, IEquipmentQueryOptions>{
  constructor(
    @InjectRepository(Equipment)
    protected readonly repository: Repository<Equipment>,
    protected readonly pagination: Pagination,
  ) {super(repository,pagination)}

  protected initializeDefaultOptions(
    options: IEquipmentQueryOptions= {}
  ): Required<IEquipmentQueryOptions> {
    return {
      filter: options.filter || new FilteringEquipmentDto(),
      joinEquipmentType: options.joinEquipmentType ?? true,
      joinWarehouse: options.joinWarehouse ?? true,
      orderMap: options.orderMap ?? {}
    };
  }

  protected createQueryBuilder(
    options: IEquipmentQueryOptions= {}
  ): SelectQueryBuilder<Equipment> {
    const {filter, joinEquipmentType, joinWarehouse, orderMap} = this.initializeDefaultOptions(options);
    const queryBuilder = this.createJoinQueryBuilder(joinEquipmentType, joinWarehouse);
    const filteredQb = this.makeFilteredQueryBuilder(queryBuilder, filter, joinWarehouse);
    const orderedQb = this.makeOrderedQueryBuilder(filteredQb, orderMap);
    return orderedQb;
  }

  protected makeFilteredQueryBuilder(
    queryBuilder: SelectQueryBuilder<Equipment>,
    filter: FilteringEquipmentDto,
    joinWarehouse: boolean = true,
  ): SelectQueryBuilder<Equipment> {
    if (filter.equipmentId) {
      queryBuilder.andWhere('equipment.id = :equipmentId', { equipmentId: filter.equipmentId });
    }
    if (filter.equipmentName) {
      queryBuilder.andWhere('equipment.name LIKE :equipmentName', { equipmentName: `%${filter.equipmentName}%` });
    }

    if (filter.equipmentTypeNameList?.length) {
      queryBuilder.andWhere('equipment_type.name IN (:...typeNames)', { typeNames: filter.equipmentTypeNameList });
    }

    if (joinWarehouse && filter.warehouseId) {
      queryBuilder.andWhere('equipment.warehouse_id = :warehouseId', { warehouseId: filter.warehouseId });
    }
    return queryBuilder;
  }

  protected createJoinQueryBuilder(
    joinEquipmentType: boolean = true,
    joinWarehouse: boolean = true,
  ): SelectQueryBuilder<Equipment> {
    const queryBuilder = this.repository.createQueryBuilder('equipment');

    if (joinEquipmentType) {
      queryBuilder.leftJoinAndSelect('equipment.equipment_type', 'equipment_type');
    }

    if (joinWarehouse) {
      queryBuilder.leftJoinAndSelect('equipment.warehouse', 'warehouse');
    }

    queryBuilder
    .select([
      'equipment.id',
      'equipment.name',
      'equipment.spec',
      'equipment.code',
      'equipment.create_date',
      'equipment.update_date',
      'equipment.valid_record',

      ...(joinEquipmentType ? [
        'equipment_type.id',
        'equipment_type.name',
        'equipment_type.type',
        'equipment_type.description',
        'equipment_type.valid_record',
      ] : []),

      ...(joinWarehouse ? [
        'warehouse.id',
        'warehouse.code',
      ] : []),
    ]);

    queryBuilder.andWhere('equipment.valid_record = :validRecord', { validRecord: true });
    return queryBuilder;
  }
}