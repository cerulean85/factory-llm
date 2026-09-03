import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { System } from '../entities/system.entity';
import { ORDER } from 'src/common/enum/db.enum';
import { Pagination } from 'src/utils/pagination.util';
import { BaseRepositoryContract } from 'src/common/repository/base-repository-contract';

export interface ISystemQueryOptions {
  orderMap?: Partial<Record<SystemOrderKey, ORDER>>;
}

export enum SystemOrderKey {
  ID = 'setting_system.id',
}

@Injectable()
export abstract class SystemBaseRepository extends BaseRepositoryContract<System, ISystemQueryOptions> {
  constructor(
    @InjectRepository(System)
    protected readonly repository: Repository<System>,
    protected readonly pagination: Pagination,
  ) {super(repository, pagination);}

  protected initializeDefaultOptions(
    options: ISystemQueryOptions = {}
  ): Required<ISystemQueryOptions> {
    return {
      orderMap: options.orderMap ?? {},
    };
  }

  protected createQueryBuilder(
    options: ISystemQueryOptions
  ): SelectQueryBuilder<System> {
    const { orderMap } = this.initializeDefaultOptions(options);
    const queryBuilder = this.createJoinQueryBuilder();
    const orderedQb = this.makeOrderedQueryBuilder(queryBuilder, orderMap);
    return orderedQb;
  }

  protected createJoinQueryBuilder(): SelectQueryBuilder<System> {
    const queryBuilder = this.repository.createQueryBuilder('setting_system');
    return queryBuilder;
  }

  protected makeFilteredQueryBuilder(
    queryBuilder: SelectQueryBuilder<System>,
  ): SelectQueryBuilder<System> {
    return queryBuilder;
  }
}