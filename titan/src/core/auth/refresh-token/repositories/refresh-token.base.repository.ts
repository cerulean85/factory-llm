import { Injectable } from '@nestjs/common';
import { RefreshToken } from '../entities/refresh-token.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { FilteringRefreshTokenDto } from '../dto/filtering-refresh-token.dto';
import { ORDER } from 'src/common/enum/db.enum';
import { BaseRepositoryContract } from 'src/common/repository/base-repository-contract';
import { Pagination } from 'src/utils/pagination.util';

export interface IRefreshTokenQueryOptions {
  filter?: FilteringRefreshTokenDto;
  joinUsers?: boolean;
  orderMap?: Partial<Record<RefreshTokenOrderKey, ORDER>>;
}

export enum RefreshTokenOrderKey {
  ID = 'refresh-token.id',
  CREATE_DATE = 'refresh-token.create_date'
}

@Injectable()
export abstract class RefreshTokenBaseRepository extends BaseRepositoryContract<RefreshToken, IRefreshTokenQueryOptions> {
  constructor(
    @InjectRepository(RefreshToken)
    protected readonly repository: Repository<RefreshToken>,
    protected readonly pagination: Pagination
  ) {super(repository, pagination);}

  protected initializeDefaultOptions(
    options: IRefreshTokenQueryOptions= {}
  ): Required<IRefreshTokenQueryOptions> {
    return {
      filter: options.filter ?? new FilteringRefreshTokenDto(),
      joinUsers: options.joinUsers ?? true,
      orderMap: options.orderMap ?? {},
    };
  }

  protected createQueryBuilder(
    options: IRefreshTokenQueryOptions
  ): SelectQueryBuilder<RefreshToken> {
    const { filter, joinUsers, orderMap } = this.initializeDefaultOptions(options);
    const queryBuilder = this.createJoinQueryBuilder(joinUsers);
    const filteredQb = this.makeFilteredQueryBuilder(queryBuilder, filter, joinUsers);
    const orderedQb = this.makeOrderedQueryBuilder(filteredQb, orderMap);
    return orderedQb;
  }

  protected makeFilteredQueryBuilder(
    queryBuilder: SelectQueryBuilder<RefreshToken>,
    filter: FilteringRefreshTokenDto,
    joinUsers?: boolean,
  ): SelectQueryBuilder<RefreshToken> {
    if (joinUsers && filter.userSeqId) {
      queryBuilder.andWhere('users.seq_id = :userSeqId', { userSeqId: filter.userSeqId });
    }
    if (filter.refreshToken) {
      queryBuilder.andWhere('refresh-token.refresh_token = :refreshToken', { refreshToken: filter.refreshToken });
    }
    return queryBuilder;
  }

  protected createJoinQueryBuilder(joinUsers: boolean = true): SelectQueryBuilder<RefreshToken> {
    const queryBuilder = this.repository.createQueryBuilder('refresh-token')
    if (joinUsers) {
      queryBuilder
      .leftJoinAndSelect('refresh-token.users', 'users')
    }

    queryBuilder
    .select([
      'refresh-token.id',
      'refresh-token.refresh_token',
      'refresh-token.create_date',
      'refresh-token.expires_date',

      ...(joinUsers ? [
        'users.seq_id',
        'users.user_id',
        'users.email',
      ] : []),
    ]);

    return queryBuilder;
  }






}