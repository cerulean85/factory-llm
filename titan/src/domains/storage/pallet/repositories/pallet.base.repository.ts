import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Pallet } from '../entities/pallet.entity';
import { FilteringPalletDto } from '../dto/request/filtering-pallet.dto';
import { ORDER } from 'src/common/enum/db.enum';
import { makeQuerybuilderToSql } from 'src/utils/database.util';
import { BaseRepositoryContract } from 'src/common/repository/base-repository-contract';
import { Pagination } from 'src/utils/pagination.util';


export interface IPalletQueryOptions {
  filter?: FilteringPalletDto;
  orderMap?: Partial<Record<PalletOrderKey, ORDER>>;
}

export enum PalletOrderKey {
  ID = 'pallet.id',
  CREATE_DATE = 'pallet.create_date',
}

@Injectable()
export abstract class PalletBaseRepository extends BaseRepositoryContract<Pallet, IPalletQueryOptions> {
  constructor(
    @InjectRepository(Pallet)
    protected readonly repository: Repository<Pallet>,
    protected readonly pagination: Pagination,
  ) {super(repository, pagination);}

  protected initializeDefaultOptions(
    options: IPalletQueryOptions= {}
  ): Required<IPalletQueryOptions> {
    return {
      filter: options.filter ?? new FilteringPalletDto(),
      orderMap: options.orderMap ?? {},
    };
  }

  protected createQueryBuilder(
    options: IPalletQueryOptions
  ): SelectQueryBuilder<Pallet> {
    const { filter, orderMap } = this.initializeDefaultOptions(options);
    const queryBuilder = this.createJoinQueryBuilder();
    const filteredQb = this.makeFilteredQueryBuilder(queryBuilder, filter);
    const orderedQb = this.makeOrderedQueryBuilder(filteredQb, orderMap);
    return orderedQb;
  }

  protected makeFilteredQueryBuilder(
    queryBuilder: SelectQueryBuilder<Pallet>,
    filter: FilteringPalletDto,
  ): SelectQueryBuilder<Pallet> {
    if (filter.palletId) {
      queryBuilder.andWhere('pallet.id = :id', { id: filter.palletId });
    }

    if (filter.code) {
      queryBuilder.andWhere('pallet.code = :code', { code: filter.code });
    }

    if (filter.startDate && filter.endDate) {
      queryBuilder.andWhere('pallet.create_date >= :startDate', { startDate: filter.startDate });
      queryBuilder.andWhere('pallet.create_date <= :endDate', { endDate: filter.endDate });
    } else if (filter.startDate) {
      queryBuilder.andWhere('pallet.create_date >= :startDate', { startDate: filter.startDate });
    } else if (filter.endDate) {
      queryBuilder.andWhere('pallet.create_date <= :endDate', { endDate: filter.endDate });
    }

    return queryBuilder;
  }

  protected createJoinQueryBuilder(): SelectQueryBuilder<Pallet> {
    const queryBuilder = this.repository.createQueryBuilder('pallet')
    return queryBuilder;
  };
}
