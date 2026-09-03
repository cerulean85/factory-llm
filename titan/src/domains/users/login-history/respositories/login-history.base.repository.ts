import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { LoginHistory } from '../entities/login-history.entity';
import { FilteringLoginHistoryDto } from '../dto/request/filtering-login-history.dto';
import { Pagination } from 'src/utils/pagination.util';
import { ORDER } from 'src/common/enum/db.enum';
import { BaseRepositoryContract } from 'src/common/repository/base-repository-contract';

export interface ILoginHistoryQueryOptions {
  filter?: FilteringLoginHistoryDto;
  joinUsers?: boolean;
  orderMap?: Partial<Record<LoginHistoryOrderKey, ORDER>>;
}

export enum LoginHistoryOrderKey {
  ID = 'login_history.id',
  CREATE_DATE = 'login_history.create_date'
}

@Injectable()
export abstract class LoginHistoryBaseRepository extends BaseRepositoryContract<LoginHistory, ILoginHistoryQueryOptions> {
  constructor(
    @InjectRepository(LoginHistory)
    protected readonly repository: Repository<LoginHistory>,
    protected readonly pagination : Pagination,
  ) {super(repository, pagination);}

  protected initializeDefaultOptions(
    options: ILoginHistoryQueryOptions= {}
  ): Required<ILoginHistoryQueryOptions> {
    return {
      filter: options.filter ?? new FilteringLoginHistoryDto(),
      joinUsers: options.joinUsers ?? true,
      orderMap: options.orderMap ?? {},
    };
  }

  protected createQueryBuilder(
    options: ILoginHistoryQueryOptions
  ): SelectQueryBuilder<LoginHistory> {
    const {filter, joinUsers, orderMap } = this.initializeDefaultOptions(options);
    const queryBuilder = this.createJoinQueryBuilder(joinUsers);
    const filteredQb = this.makeFilteredQueryBuilder(queryBuilder, filter);
    const orderedQb = this.makeOrderedQueryBuilder(filteredQb, orderMap);
    return orderedQb;
  }

  protected makeFilteredQueryBuilder(
    queryBuilder: SelectQueryBuilder<LoginHistory>,
    filter: FilteringLoginHistoryDto,
  ): SelectQueryBuilder<LoginHistory> {
    if (filter.loginHistoryId) {
      queryBuilder.andWhere('login_history.id = :loginHistoryId', { loginHistoryId: filter.loginHistoryId });
    }
    if (filter.userSeqId) {
      queryBuilder.andWhere('users.seq_id = :userSeqId', { userSeqId: filter.userSeqId });
    }

    if (filter.startDate && filter.endDate) {
      queryBuilder.andWhere('login_history.create_date >= :startDate', { startDate: filter.startDate })
        .andWhere('login_history.create_date <= :endDate', { endDate: filter.endDate });
    } else if (filter.startDate) {
      queryBuilder.andWhere('login_history.create_date >= :startDate', { startDate: filter.startDate });
    } else if (filter.endDate) {
      queryBuilder.andWhere('login_history.create_date <= :endDate', { endDate: filter.endDate });
    }

    if (filter.keyword && filter.keyword !== '') {
      queryBuilder.andWhere('(users.user_id LIKE :keyword OR login_history.try_ip LIKE :keyword OR users.name LIKE :keyword OR users.user_id LIKE :keyword)', { keyword: `%${filter.keyword}%`});
    }

    return queryBuilder;
  }
  
  protected createJoinQueryBuilder(joinUsers: boolean = true): SelectQueryBuilder<LoginHistory> {
    const queryBuilder = this.repository.createQueryBuilder('login_history')
    if (joinUsers) {
      queryBuilder
        .leftJoinAndSelect('login_history.users', 'users')
    }

    queryBuilder
    .select([
      'login_history.id',
      'login_history.try_ip',
      'login_history.create_date',

      ...(joinUsers ? [
        'users.seq_id',
        'users.user_id',
        'users.name',
      ] : []),
    ]);
    return queryBuilder;
  }
}