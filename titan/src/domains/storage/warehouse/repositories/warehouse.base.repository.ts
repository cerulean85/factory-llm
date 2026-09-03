import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Warehouse } from '../entities/warehouse.entity';
import { BaseRepositoryContract } from 'src/common/repository/base-repository-contract';
import { Pagination } from 'src/utils/pagination.util';
import { FilteringWarehouseDto } from '../dto/request/filtering-warehouse.dto';
import { ORDER } from 'src/common/enum/db.enum';

export interface IWarehouseQueryOptions {
  filter?: FilteringWarehouseDto;
  orderMap?: Partial<Record<WarehouseOrderKey, ORDER>>;
}

export enum WarehouseOrderKey {
  ID = 'warehouse.id',
}

@Injectable()
export abstract class WarehouseBaseRepository extends BaseRepositoryContract<Warehouse, IWarehouseQueryOptions> {
  constructor(
    @InjectRepository(Warehouse)
    protected readonly repository: Repository<Warehouse>,
    protected readonly pagination: Pagination
  ) {super(repository, pagination);}

  protected initializeDefaultOptions(
    options: IWarehouseQueryOptions = {}
  ): Required<IWarehouseQueryOptions> {
    return {
      filter: options.filter ?? new FilteringWarehouseDto(),
      orderMap: options.orderMap ?? {},
    };
  }

  protected createQueryBuilder(
    options: IWarehouseQueryOptions
  ): SelectQueryBuilder<Warehouse> {
    const { filter, orderMap } = this.initializeDefaultOptions(options);
    const queryBuilder = this.createJoinQueryBuilder();
    const filteredQb = this.makeFilteredQueryBuilder(queryBuilder, filter);
    const orderedQb = this.makeOrderedQueryBuilder(filteredQb, orderMap);
    return orderedQb;
  }

  protected makeFilteredQueryBuilder(
    queryBuilder: SelectQueryBuilder<Warehouse>,
    filter: FilteringWarehouseDto
  ): SelectQueryBuilder<Warehouse> {
    if (filter.warehouseId) {
      queryBuilder.andWhere('warehouse.id = :id', { id: filter.warehouseId });
    }
    if (filter.code) {
      queryBuilder.andWhere('warehouse.code = :code', { code: filter.code });
    }
    if (filter.name) {
      queryBuilder.andWhere('warehouse.name = :name', { name: filter.name });
    }
    return queryBuilder;
  }

  protected createJoinQueryBuilder(): SelectQueryBuilder<Warehouse> {
    const queryBuilder = this.repository.createQueryBuilder('warehouse');
    return queryBuilder;
  }
}
