import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Role } from '../entities/role.entity';
import { Pagination } from 'src/utils/pagination.util';
import { ORDER } from 'src/common/enum/db.enum';
import { BaseRepositoryContract } from 'src/common/repository/base-repository-contract';
import { FilteringRoleDto } from '../dto/request/filtering-role.dto';

export interface IRoleQueryOptions {
  filter?: FilteringRoleDto;
  joinUsers?: boolean;
  orderMap?: Partial<Record<RoleOrderKey, ORDER>>;
}

export enum RoleOrderKey {
  ID = 'role.id',
  CREATE_DATE = 'role.create_date'
}

@Injectable()
export abstract class RoleBaseRepository extends BaseRepositoryContract<Role, IRoleQueryOptions> {
  constructor(
    @InjectRepository(Role)
    protected readonly repository: Repository<Role>,
    protected readonly pagination : Pagination
  ) {super(repository, pagination);}

  protected initializeDefaultOptions(
    options: IRoleQueryOptions = {}
  ): Required<IRoleQueryOptions> {
    return {
      filter: options.filter ?? new FilteringRoleDto(),
      joinUsers: options.joinUsers ?? true,
      orderMap: options.orderMap ?? {},
    };
  }

  protected createQueryBuilder(
    options: IRoleQueryOptions
  ): SelectQueryBuilder<Role>
  {
    const { filter, joinUsers, orderMap } = this.initializeDefaultOptions(options);
    const queryBuilder = this.createJoinQueryBuilder(joinUsers);
    const filteredQb = this.makeFilteredQueryBuilder(queryBuilder, filter, joinUsers);
    const orderedQb = this.makeOrderedQueryBuilder(filteredQb, orderMap);
    return orderedQb;
  }

  protected createJoinQueryBuilder(joinUsers: boolean = true): SelectQueryBuilder<Role> {
    const queryBuilder = this.repository.createQueryBuilder('role')
    if (joinUsers) {
      queryBuilder.leftJoinAndSelect('role.users', 'users')
    }

    queryBuilder.select([
      'role.id',
      'role.create_date',
      'role.update_date',
      'role.type',

      ...(joinUsers ? [
        'users.seq_id',
        'users.user_id',
        'users.name',
        'users.email'
      ] : []),
    ]);

    return queryBuilder;
  }

  protected makeFilteredQueryBuilder(
    queryBuilder: SelectQueryBuilder<Role>,
    filter: FilteringRoleDto,
    joinUsers: boolean
  ): SelectQueryBuilder<Role> {
    if (filter.id) {
      queryBuilder.andWhere('role.id = :id', { id: filter.id });
    }
    if (filter.type) {
      queryBuilder.andWhere('role.type = :type', { type: filter.type });
    }
    if (joinUsers && filter.userSeqId) {
      queryBuilder.andWhere('users.seq_id = :userSeqId', { userSeqId: filter.userSeqId });
    }
    if (filter.validRecord) {
      queryBuilder.andWhere('role.valid_record = :validRecord', { validRecord: filter.validRecord });
    }
    return queryBuilder;
  }
}