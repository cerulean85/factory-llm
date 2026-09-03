import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { ORDER } from 'src/common/enum/db.enum';
import { FilteringStoredItemDto } from '../dto/filtering-stored-item.dto';
import { StoredItem } from '../entities/stored-item.entity';
import { BaseRepositoryContract } from 'src/common/repository/base-repository-contract';
import { Pagination } from 'src/utils/pagination.util';


export interface IStoredItemQueryOptions {
  filter?: FilteringStoredItemDto;
  orderMap?: Partial<Record<StoredItemOrderKey, ORDER>>;
}

export enum StoredItemOrderKey {
  ID = 'stored_item.id',
  CREATE_DATE = 'stored_item.create_date',
}

@Injectable()
export abstract class StoredItemBaseRepository extends BaseRepositoryContract<StoredItem, IStoredItemQueryOptions> {
  constructor(
    @InjectRepository(StoredItem)
    protected readonly repository: Repository<StoredItem>,
    protected readonly pagination: Pagination,
  ) {super(repository, pagination);}

  protected initializeDefaultOptions(
    options: IStoredItemQueryOptions= {}
  ): Required<IStoredItemQueryOptions> {
    return {
      filter: options.filter ?? new FilteringStoredItemDto(),
      orderMap: options.orderMap ?? {},
    };
  }

  protected createQueryBuilder(
    options: IStoredItemQueryOptions
  ): SelectQueryBuilder<StoredItem> {
    const { filter, orderMap } = this.initializeDefaultOptions(options);
    const queryBuilder = this.createJoinQueryBuilder();
    const filteredQb = this.makeFilteredQueryBuilder(queryBuilder, filter);
    const orderedQb = this.makeOrderedQueryBuilder(filteredQb, orderMap);
    return orderedQb;
  }

  protected makeFilteredQueryBuilder(
    queryBuilder: SelectQueryBuilder<StoredItem>,
    filter: FilteringStoredItemDto,
  ): SelectQueryBuilder<StoredItem> {
    if (filter.storedItemId) {
      queryBuilder.andWhere('stored_item.id = :id', { id: filter.storedItemId });
    }

    if (filter.standardType) {
      queryBuilder.andWhere('stored_item.standard_type = :standardType', { standardType: filter.standardType });
    }

    if (filter.skuId) {
      queryBuilder.andWhere('stored_item.sku_id LIKE :skuId', { skuId: `%${filter.skuId}%` });
    }

    return queryBuilder;
  }

  protected createJoinQueryBuilder(): SelectQueryBuilder<StoredItem> {
    const queryBuilder = this.repository.createQueryBuilder('stored_item')

    queryBuilder
      .select([
        'stored_item.id',
        'stored_item.standard_type',
        'stored_item.detail',
        'stored_item.create_date',
        'stored_item.update_date',
        'stored_item.sku_id',
      ]);
    return queryBuilder;
  };
}