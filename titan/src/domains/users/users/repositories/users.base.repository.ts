import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Users } from '../entities/users.entity';
import { Pagination } from 'src/utils/pagination.util';
import { FilteringUsersDto } from '../dto/request/filtering-user.dto';
import { ORDER } from 'src/common/enum/db.enum';
import { BaseRepositoryContract } from 'src/common/repository/base-repository-contract';

export interface IUsersQueryOptions {
  filter?: FilteringUsersDto;
  orderMap?: Partial<Record<UsersOrderKey, ORDER>>;
}

export enum UsersOrderKey {
  ID = 'users.seq_id',
  CREATE_DATE = 'users.create_date'
}

@Injectable()
export abstract class UsersBaseRepository extends BaseRepositoryContract<Users, IUsersQueryOptions>  {
  constructor(
    @InjectRepository(Users)
    protected readonly repository: Repository<Users>,
    protected readonly pagination: Pagination,
  ) {super(repository, pagination);}

  protected initializeDefaultOptions(options: IUsersQueryOptions = {}): Required<IUsersQueryOptions> {
    return {
      filter: options.filter ?? new FilteringUsersDto(),
      orderMap: options.orderMap ?? {},
    };
  }

  protected createQueryBuilder(
    options: IUsersQueryOptions
  ): SelectQueryBuilder<Users> {
    const {filter, orderMap } = this.initializeDefaultOptions(options);
    const queryBuilder = this.createJoinQueryBuilder();
    const filteredQb = this.makeFilteredQueryBuilder(queryBuilder, filter);
    const orderedQb = this.makeOrderedQueryBuilder(filteredQb, orderMap);

    return orderedQb;
  }

  protected createJoinQueryBuilder(): SelectQueryBuilder<Users> {
    const queryBuilder = this.repository.createQueryBuilder('users')
      .where({ valid_record: true })

    return queryBuilder;
  }

  protected makeFilteredQueryBuilder(
    queryBuilder: SelectQueryBuilder<Users>,
    filter: FilteringUsersDto
  ): SelectQueryBuilder<Users> {
    if (filter.seqId) {
      queryBuilder.andWhere('users.seq_id = :seqId', { seqId: filter.seqId });
    }
    if (filter.seqIdList) {
      queryBuilder.andWhere('users.seq_id IN (:...seqIdList)', { seqIdList: filter.seqIdList });
    }
    if (filter.userId) {
      queryBuilder.andWhere('users.user_id = :userId', { userId: filter.userId });
    }
    if (filter.email) {
      queryBuilder.andWhere('users.email = :email', { email: filter.email });
    }
    if (filter.phoneNumber) {
      queryBuilder.andWhere('users.phone_number = :phoneNumber', { phoneNumber: filter.phoneNumber });
    }
    if (filter.startDate && filter.endDate) {
      queryBuilder.andWhere('users.create_date BETWEEN :startDate AND :endDate', { startDate: filter.startDate, endDate: filter.endDate });
    } else if (filter.startDate) {
      queryBuilder.andWhere('users.create_date >= :startDate', { startDate: filter.startDate });
    } else if (filter.endDate) {
      queryBuilder.andWhere('users.create_date <= :endDate', { endDate: filter.endDate });
    }
    if (filter.keyword) {
      queryBuilder.andWhere(
        '(users.user_id LIKE :keyword OR users.name LIKE :keyword OR users.affiliation LIKE :keyword OR users.phone_number LIKE :keyword OR users.email LIKE :keyword)', { keyword: `%${filter.keyword}%` });
    }
    if (filter.validRecord) {
      queryBuilder.andWhere('users.valid_record = :validRecord', { validRecord: filter.validRecord });
    }
    return queryBuilder;
  }
}