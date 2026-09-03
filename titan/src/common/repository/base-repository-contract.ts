import { Pagination } from 'src/utils/pagination.util';
import { SelectQueryBuilder, Repository, ObjectLiteral } from 'typeorm';
import { PaginationResponseDto } from '../dto/pagination-response.dto';
import { ORDER } from '../enum/db.enum';

export abstract class BaseRepositoryContract<
  TEntity extends ObjectLiteral,
  TOptions,
>  {
  protected readonly repository: Repository<TEntity>;
  protected readonly pagination: Pagination;

  constructor(
    repository: Repository<TEntity>,
    pagination: Pagination,
  ) {
    this.repository = repository;
    this.pagination = pagination;
  }

  async getFilteredOne(options?: TOptions): Promise<TEntity | null> {
    return this.createQueryBuilder(options).getOne();
  }

  async getFilteredList(options?: TOptions): Promise<TEntity[]> {
    return this.createQueryBuilder(options).getMany();
  }

  async getFilteredCount(options?: TOptions): Promise<number> {
    return this.createQueryBuilder(options).getCount();
  }

  async getFilteredPaginatedList(options?: TOptions): Promise<PaginationResponseDto<TEntity>> {
    const qb = this.createQueryBuilder(options);
    const filter = (options as any)?.filter ?? {};
    return await this.pagination.paginateWithQueryBuilder(qb, filter);
  }

  async getFilteredLimit(limit: number, options?: TOptions): Promise<TEntity[]> {
    const qb = this.createQueryBuilder(options);
    qb.limit(limit);
    return qb.getMany();
  }

  async getFilteredListByIds(ids: number[], options?: TOptions): Promise<TEntity[]>{
    const qb = this.createQueryBuilder(options);
    const filteredQb = qb.where(`${qb.alias}.id IN (:...ids)`, {ids});
    return await filteredQb.getMany();
  }

  protected abstract initializeDefaultOptions(
    options?: any,
  ): Required<any>;

  protected abstract createQueryBuilder(
    options?: any
  ): SelectQueryBuilder<TEntity>;

  protected abstract makeFilteredQueryBuilder(
    queryBuilder: SelectQueryBuilder<TEntity>,
    filter: any,
    join?: any,
  ): SelectQueryBuilder<TEntity>;

  protected makeOrderedQueryBuilder(
    queryBuilder: SelectQueryBuilder<TEntity>,
    orderMap: Partial<Record<string, ORDER>> = {},
  ): SelectQueryBuilder<TEntity> {
    const entries = Object.entries(orderMap) as [string, ORDER][];
    if (entries.length === 0) return queryBuilder;

    for (const [column, dir] of entries) {
      if (!dir) continue;
      queryBuilder.addOrderBy(column, dir);
    }
    return queryBuilder;
  }

  protected abstract createJoinQueryBuilder(
    join?: any,
  ): SelectQueryBuilder<TEntity>;

  
}