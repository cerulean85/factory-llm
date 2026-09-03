import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { RealtimeWarehouseView } from '../entities/realtime-warehouse-view.entity';
import { FilteringRealtimeWarehouseViewDto } from '../dto/request/filtering-realtime-warehouse-view.dto';
import { ORDER } from 'src/common/enum/db.enum';
import { BaseRepositoryContract } from 'src/common/repository/base-repository-contract';
import { Pagination } from 'src/utils/pagination.util';

export interface IRealtimeWarehouseViewQueryOptions {
  filter?: FilteringRealtimeWarehouseViewDto;
  joinWarehouse?: boolean;
  orderMap?: Partial<Record<RealtimeWarehouseViewOrderKey, ORDER>>;
}

export enum RealtimeWarehouseViewOrderKey {
  ID = 'realtime_warehouse_view.id',
}

@Injectable()
export abstract class RealtimeWarehouseViewBaseRepository extends BaseRepositoryContract<RealtimeWarehouseView, IRealtimeWarehouseViewQueryOptions> {
  constructor(
    @InjectRepository(RealtimeWarehouseView)
    protected readonly repository: Repository<RealtimeWarehouseView>,
    protected readonly pagination: Pagination
  ) {super(repository, pagination);}

  protected initializeDefaultOptions(
    options: IRealtimeWarehouseViewQueryOptions= {}
  ): Required<IRealtimeWarehouseViewQueryOptions> {
    return {
      filter: options.filter ?? new FilteringRealtimeWarehouseViewDto(),
      joinWarehouse: options.joinWarehouse ?? true,
      orderMap: options.orderMap ?? {},
    };
  }

  protected createQueryBuilder(
    options: IRealtimeWarehouseViewQueryOptions
  ): SelectQueryBuilder<RealtimeWarehouseView> {
    const { filter, joinWarehouse, orderMap } = this.initializeDefaultOptions(options);
    const queryBuilder = this.createJoinQueryBuilder(joinWarehouse);
    const filteredQb = this.makeFilteredQueryBuilder(queryBuilder, filter, joinWarehouse);
    const orderedQb = this.makeOrderedQueryBuilder(filteredQb, orderMap);
    return orderedQb;
  }

  protected createJoinQueryBuilder(joinWarehouse: boolean = true): SelectQueryBuilder<RealtimeWarehouseView> {
    const queryBuilder = this.repository.createQueryBuilder('realtime_warehouse_view')
    if (joinWarehouse) {
      queryBuilder.leftJoinAndSelect('realtime_warehouse_view.warehouse', 'warehouse');
    }

    queryBuilder
    .select([
      'realtime_warehouse_view.id',
      'realtime_warehouse_view.equipment_code',
      'realtime_warehouse_view.loc_x',
      'realtime_warehouse_view.loc_y',
      'realtime_warehouse_view.loc_z',
      'realtime_warehouse_view.loaded',
      'realtime_warehouse_view.use_type',
      'realtime_warehouse_view.standard_type',
      'realtime_warehouse_view.st_count',
      ...(joinWarehouse ? [
        'warehouse.id',
        'warehouse.type',
      ] : []),
    ]);
    return queryBuilder;
  }

  protected makeFilteredQueryBuilder(
    queryBuilder: SelectQueryBuilder<RealtimeWarehouseView>,
    filter: FilteringRealtimeWarehouseViewDto,
    joinWarehouse: boolean,
  ): SelectQueryBuilder<RealtimeWarehouseView> {
    if (filter.id && filter.id > 0) {
      queryBuilder.andWhere('realtime_warehouse_view.id = :id', { id: filter.id });
    }
    if (filter.loaded) {
      queryBuilder.andWhere('realtime_warehouse_view.loaded = :loaded', { loaded: filter.loaded });
    }
    if (filter.useType) {
      queryBuilder.andWhere('realtime_warehouse_view.use_type = :useType', { useType: filter.useType });
    }
    if (joinWarehouse && filter.warehouseId && filter.warehouseId > 0) {
      queryBuilder.andWhere('warehouse.id = :warehouseId', { warehouseId: filter.warehouseId });
    }
    return queryBuilder;
  }
};