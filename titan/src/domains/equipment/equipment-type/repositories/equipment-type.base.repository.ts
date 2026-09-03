import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { EquipmentType } from '../entities/equipment-type.entity';
import { CreateEquipmentTypeDto } from '../dto/request/create-equipment-type.dto';
import { ORDER } from 'src/common/enum/db.enum';
import { FilteringEquipmentTypeDto } from '../dto/request/filtering-equipment-type.dto';
import { BaseRepositoryContract } from 'src/common/repository/base-repository-contract';
import { Pagination } from 'src/utils/pagination.util';

export interface IEquipmentTypeQueryOptions {
  filter?: FilteringEquipmentTypeDto;
  orderMap?: Partial<Record<EquipmentTypeOrderKey, ORDER>>;
}

export enum EquipmentTypeOrderKey{
  ID = 'equipment_type.id',
}

@Injectable()
export class EquipmentTypeBaseRepository extends BaseRepositoryContract<EquipmentType, IEquipmentTypeQueryOptions> {
  constructor(
    @InjectRepository(EquipmentType)
    protected readonly repository: Repository<EquipmentType>,
    protected readonly pagination: Pagination
  ) {super(repository, pagination)}

  protected initializeDefaultOptions(
    options: IEquipmentTypeQueryOptions = {}
  ): Required<IEquipmentTypeQueryOptions> {
    return {
      filter: options.filter ?? new FilteringEquipmentTypeDto(),
      orderMap: options.orderMap ?? {},
    };
  }

  protected createQueryBuilder(
    options: IEquipmentTypeQueryOptions
  ): SelectQueryBuilder<EquipmentType> {
    const {filter, orderMap} = this.initializeDefaultOptions(options);
    const queryBuilder = this.createJoinQueryBuilder();
    const filteredQb = this.makeFilteredQueryBuilder(queryBuilder, filter);
    const orderedQb = this.makeOrderedQueryBuilder(filteredQb, orderMap);
    return orderedQb;
  }


  protected createJoinQueryBuilder(): SelectQueryBuilder<EquipmentType> {
    const queryBuilder = this.repository.createQueryBuilder('equipment_type');
    return queryBuilder;
  }

  protected makeFilteredQueryBuilder(
    queryBuilder: SelectQueryBuilder<EquipmentType>,
    filter: FilteringEquipmentTypeDto
  ): SelectQueryBuilder<EquipmentType> {
    if (filter.equipmentTypeId) {
      queryBuilder.andWhere('equipment_type.id = :id', { id: filter.equipmentTypeId });
    }
    if (filter.equipmentTypeName) {
      queryBuilder.andWhere('equipment_type.name = :name', { name: filter.equipmentTypeName });
    }
    return queryBuilder;
  }
}