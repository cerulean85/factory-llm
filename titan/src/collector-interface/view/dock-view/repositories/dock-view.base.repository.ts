import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { ORDER } from 'src/common/enum/db.enum';
import { DockView } from '../entities/dock-view.entity';
import { FilteringDockViewDto } from '../dto/request/filtering-dock-view.dto';
import { BaseRepositoryContract } from 'src/common/repository/base-repository-contract';
import { Pagination } from 'src/utils/pagination.util';

export interface IDockQueryOptions {
  filter?: FilteringDockViewDto;
  orderMap?: Partial<Record<DockViewOrderKey, ORDER>>;
}

export enum DockViewOrderKey {
  ID = 'dock_view.id',
}

@Injectable()
export abstract class DockViewBaseRepository extends BaseRepositoryContract<DockView, IDockQueryOptions> {
  constructor(
    @InjectRepository(DockView)
    protected readonly repository: Repository<DockView>,
    protected readonly pagination: Pagination
  ) {super(repository, pagination);}

  protected initializeDefaultOptions(
    options: IDockQueryOptions= {}
  ): Required<IDockQueryOptions> {
    return {
      filter: options.filter ?? new FilteringDockViewDto(),
      orderMap: options.orderMap ?? {},
    };
  }

  protected createQueryBuilder(
    options: IDockQueryOptions
  ): SelectQueryBuilder<DockView> {
    const { filter, orderMap } = this.initializeDefaultOptions(options);
    const queryBuilder = this.createJoinQueryBuilder();
    const filteredQb = this.makeFilteredQueryBuilder(queryBuilder, filter);
    const orderedQb = this.makeOrderedQueryBuilder(filteredQb, orderMap);
    return orderedQb;
  }

  protected makeFilteredQueryBuilder(queryBuilder: SelectQueryBuilder<DockView>, filter: FilteringDockViewDto): SelectQueryBuilder<DockView> {
    if (filter.dockId) {
      queryBuilder.andWhere('dock_view.id = :dockId', { dockId: filter.dockId });
    }

    if (filter.gantryCode) {
      queryBuilder.andWhere('dock_view.gantry_code = :gantryCode', { gantryCode: filter.gantryCode });
    }

    if (filter.status) {
      queryBuilder.andWhere('dock_view.status = :status', { status: filter.status });
    }    
    return queryBuilder;
  }

  protected createJoinQueryBuilder(): SelectQueryBuilder<DockView> {
    const queryBuilder = this.repository.createQueryBuilder('dock_view')

    queryBuilder
      .select([
        'dock_view.id',
        'dock_view.dock_no',
        'dock_view.gantry_code',
        'dock_view.status',
        'dock_view.shipment_order',
        'dock_view.container_no',
        'dock_view.unit_order_count',
        'dock_view.order_count',
        'dock_view.outing_count',
        'dock_view.in_gantry_count',
        'dock_view.conveyor_count',
        'dock_view.completion_count',
        'dock_view.remand_count',
        'dock_view.bad_count',
      ]);
    return queryBuilder;
  };
}