import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { ORDER } from 'src/common/enum/db.enum';
import { ItemMasterView } from '../entities/item-master-view.entity';
import { FilteringItemMasterViewDto } from '../dto/request/filtering-item-master-view.dto';
import { BaseRepositoryContract } from 'src/common/repository/base-repository-contract';
import { Pagination } from 'src/utils/pagination.util';

export interface IItemMasterViewQueryOptions {
  filter?: FilteringItemMasterViewDto;
  orderMap?: Partial<Record<ItemMasterViewOrderKey, ORDER>>;
}

export enum ItemMasterViewOrderKey {
  SKU_KEY = 'item_master_view.sku_key',
}

@Injectable()
export abstract class ItemMasterViewBaseRepository extends BaseRepositoryContract<ItemMasterView, IItemMasterViewQueryOptions> {
  constructor(
    @InjectRepository(ItemMasterView)
    protected readonly repository: Repository<ItemMasterView>,
    protected readonly pagination: Pagination
  ) {super(repository, pagination);}

  protected initializeDefaultOptions(
    options: IItemMasterViewQueryOptions= {}
  ): Required<IItemMasterViewQueryOptions> {
    return {
      filter: options.filter ?? new FilteringItemMasterViewDto(),
      orderMap: options.orderMap ?? {},
    };
  }

  protected createQueryBuilder(
    options: IItemMasterViewQueryOptions
  ): SelectQueryBuilder<ItemMasterView> {
    const { filter, orderMap } = this.initializeDefaultOptions(options);
    const queryBuilder = this.createJoinQueryBuilder();
    const filteredQb = this.makeFilteredQueryBuilder(queryBuilder, filter);
    const orderedQb = this.makeOrderedQueryBuilder(filteredQb, orderMap);
    return orderedQb;
  }

  protected makeFilteredQueryBuilder(queryBuilder: SelectQueryBuilder<ItemMasterView>, filter: FilteringItemMasterViewDto): SelectQueryBuilder<ItemMasterView> {
    if (filter.skuKey) {
      queryBuilder.andWhere('item_master_view.sku_key = :skuKey', { skuKey: filter.skuKey });
    }

    if (filter.standardType) {
      queryBuilder.andWhere('item_master_view.standard_type = :standardType', { standardType: filter.standardType });
    }

    return queryBuilder;
  }

  protected createJoinQueryBuilder(): SelectQueryBuilder<ItemMasterView> {
    const queryBuilder = this.repository.createQueryBuilder('item_master_view')

    queryBuilder
      .select([
        'item_master_view.sku_key',
        'item_master_view.standard_type',
      ]);

    return queryBuilder;
  };
}