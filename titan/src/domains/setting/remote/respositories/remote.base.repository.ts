import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Remote } from '../entities/remote.entity';
import { ORDER } from 'src/common/enum/db.enum';
import { FilteringRemoteDto } from '../dto/request/filtering-remote.dto';
import { BaseRepositoryContract } from 'src/common/repository/base-repository-contract';
import { Pagination } from 'src/utils/pagination.util';

export interface IRemoteQueryOptions {
  filter?: FilteringRemoteDto;
  joinUsers?: boolean;
  orderMap?: Partial<Record<RemoteOrderKey, ORDER>>;
}

export enum RemoteOrderKey{
  ID = 'setting_remote.id',
  CREATE_DATE = 'setting_remote.create_date'
}

@Injectable()
export class RemoteBaseRepository extends BaseRepositoryContract<Remote, IRemoteQueryOptions> {
  constructor(
    @InjectRepository(Remote)
    protected readonly repository: Repository<Remote>,
    protected readonly pagination: Pagination
  ) {super(repository, pagination);}

  protected initializeDefaultOptions(
    options: IRemoteQueryOptions = {}
  ): Required<IRemoteQueryOptions> {
    return {
      filter: options.filter ?? new FilteringRemoteDto(),
      joinUsers: options.joinUsers ?? true,
      orderMap: options.orderMap ?? {},
    };
  }

  protected createQueryBuilder(
    options: IRemoteQueryOptions
  ): SelectQueryBuilder<Remote> {
    const {filter, joinUsers, orderMap } = this.initializeDefaultOptions(options);
    const queryBuilder = this.createJoinQueryBuilder(joinUsers);
    const filteredQb = this.makeFilteredQueryBuilder(queryBuilder, filter, joinUsers);
    const orderedQb = this.makeOrderedQueryBuilder(filteredQb, orderMap);

    return orderedQb;
  }

  protected makeFilteredQueryBuilder(
    queryBuilder: SelectQueryBuilder<Remote>,
    filter: FilteringRemoteDto,
    joinUsers: boolean = true
  ): SelectQueryBuilder<Remote> {
    if (filter.remoteId) {
      queryBuilder.andWhere('setting_remote.id = :id', { id: filter.remoteId });
    }
    if (joinUsers && filter.userSeqId) {
      queryBuilder.andWhere('users.seq_id = :userSeqId', { userSeqId: filter.userSeqId });
    }
    return queryBuilder;
  }

  protected createJoinQueryBuilder(joinUsers: boolean = true): SelectQueryBuilder<Remote> {
    const queryBuilder = this.repository.createQueryBuilder('setting_remote')

    if (joinUsers) {
      queryBuilder
      .leftJoinAndSelect('setting_remote.users', 'users')
    }

    queryBuilder
    .select([
      'setting_remote.id',
      'setting_remote.create_date',
      'setting_remote.update_date',
      'setting_remote.valid_record',
      'setting_remote.location',
      'setting_remote.ip',
      'setting_remote.port',

      ...(joinUsers ? [
        'users.seq_id',
        'users.user_id',
        'users.name',
        'users.email'

      ] : []),
    ]);

    queryBuilder
    .where('setting_remote.valid_record = :validRecord', { validRecord: true })

    return queryBuilder;
  }
}