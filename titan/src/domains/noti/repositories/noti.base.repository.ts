import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';

import { Noti } from '../entities/noti.entity';
import { Pagination } from 'src/utils/pagination.util';
import { FilteringNotiDto } from '../dto/request/filtering-noti.dto';
import { ORDER } from 'src/common/enum/db.enum';
import { BaseRepositoryContract } from 'src/common/repository/base-repository-contract';

export interface INotiQueryOptions {
  filter?: FilteringNotiDto;
  joinUsers?: boolean;
  orderMap?: Partial<Record<NotiOrderKey, ORDER>>;
}

export enum NotiOrderKey {
  ID = 'noti.id',
  CREATE_DATE = 'noti.create_date',
}

@Injectable()
export abstract class NotiBaseRepository extends BaseRepositoryContract<Noti, INotiQueryOptions> {
  constructor(
    @InjectRepository(Noti)
    protected readonly repository: Repository<Noti>,
    protected readonly pagination: Pagination,
  ) {super(repository, pagination);}

  protected initializeDefaultOptions(options: INotiQueryOptions = {}): Required<INotiQueryOptions> {
    return {
      filter: options.filter ?? new FilteringNotiDto(),
      joinUsers: options.joinUsers ?? true,
      orderMap: options.orderMap ?? {},
    };
  }

  protected createQueryBuilder(
    options: INotiQueryOptions
  ): SelectQueryBuilder<Noti> {
    const { filter, joinUsers, orderMap } = this.initializeDefaultOptions(options);
    const queryBuilder = this.createJoinQueryBuilder(joinUsers);
    const filteredQb = this.makeFilteredQueryBuilder(queryBuilder, filter);
    const orderedQb = this.makeOrderedQueryBuilder(filteredQb, orderMap);

    return orderedQb;
  }

  protected makeFilteredQueryBuilder(
    queryBuilder: SelectQueryBuilder<Noti>,
    filter: FilteringNotiDto
  ): SelectQueryBuilder<Noti> {
    if (filter.notiId) {
      queryBuilder.andWhere('noti.id = :id', { id: filter.notiId });
    }
    if (filter.keyword) {
      queryBuilder.andWhere('(noti.title LIKE :keyword OR noti.content LIKE :keyword)', { keyword: `%${filter.keyword}%` });
    }
    if (filter.startDate && filter.endDate) {
      queryBuilder.andWhere('noti.create_date BETWEEN :startDate AND :endDate', { startDate: filter.startDate, endDate: filter.endDate });
    } else if (filter.startDate) {
      queryBuilder.andWhere('noti.create_date >= :startDate', { startDate: filter.startDate });
    } else if (filter.endDate) {
      queryBuilder.andWhere('noti.create_date <= :endDate', { endDate: filter.endDate });
    }
    return queryBuilder;
  }

  protected createJoinQueryBuilder(joinUsers: boolean = true): SelectQueryBuilder<Noti> {
    const queryBuilder = this.repository.createQueryBuilder('noti')
    if (joinUsers) {
      queryBuilder
      .leftJoinAndSelect('noti.users', 'users')
    }

    queryBuilder
    .select([
      'noti.id',
      'noti.title',
      'noti.content',
      'noti.create_date',
      'noti.update_date',
      'noti.valid_record',

      ...(joinUsers ? [
        'users.seq_id',
        'users.user_id',
        'users.name',
      ] : []),
    ]);
    queryBuilder
    .where('noti.valid_record = :validRecord', { validRecord: true })

    return queryBuilder;
  }
}