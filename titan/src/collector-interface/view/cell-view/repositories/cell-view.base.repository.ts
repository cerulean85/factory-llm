import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { ORDER } from 'src/common/enum/db.enum';
import { CellView } from '../entities/cell-view.entity';
import { FilteringCellViewDto } from '../dto/request/filtering-cell-view.dto';
import { BaseRepositoryContract } from 'src/common/repository/base-repository-contract';
import { Pagination } from 'src/utils/pagination.util';

export interface ICellViewQueryOptions {
  filter?: FilteringCellViewDto;
  joinPallet?: boolean;
  joinWarehouse?: boolean;
  orderMap?: Partial<Record<CellViewOrderKey, ORDER>>;
}

export enum CellViewOrderKey {
  ID = 'cell_view.id',
}

@Injectable()
export abstract class CellViewBaseRepository extends BaseRepositoryContract<CellView, ICellViewQueryOptions> {
  constructor(
    @InjectRepository(CellView)
    protected readonly repository: Repository<CellView>,
    protected readonly pagination: Pagination
  ) {super(repository, pagination);}

  protected initializeDefaultOptions(
    options: ICellViewQueryOptions= {}
  ): Required<ICellViewQueryOptions> {
    return {
      filter: options.filter ?? new FilteringCellViewDto(),
      joinPallet: options.joinPallet ?? true,
      joinWarehouse: options.joinWarehouse ?? true,
      orderMap: options.orderMap ?? {},
    };
  }

  protected createQueryBuilder(
    options: ICellViewQueryOptions
  ): SelectQueryBuilder<CellView> {
    const { filter, joinPallet, joinWarehouse, orderMap } = this.initializeDefaultOptions(options);
    const queryBuilder = this.createJoinQueryBuilder(joinPallet, joinWarehouse);
    const filteredQb = this.makeFilteredQueryBuilder(queryBuilder, filter, {joinPallet, joinWarehouse});
    const orderedQb = this.makeOrderedQueryBuilder(filteredQb, orderMap);
    return orderedQb;
  }

  protected makeFilteredQueryBuilder(
    queryBuilder: SelectQueryBuilder<CellView>,
    filter: FilteringCellViewDto,
    join: {joinPallet: boolean, joinWarehouse: boolean}
  ): SelectQueryBuilder<CellView> {
    if (join.joinPallet && filter.palletId) {
      queryBuilder.andWhere('pallet.id = :palletId', { palletId: filter.palletId });
    }

    if (filter.locX) {
      queryBuilder.andWhere('cell_view.loc_x = :locX', { locX: filter.locX });
    }

    if (filter.locY) {
      queryBuilder.andWhere('cell_view.loc_y = :locY', { locY: filter.locY });
    }

    if (filter.locZ) {
      queryBuilder.andWhere('cell_view.loc_z = :locZ', { locZ: filter.locZ });
    }

    if (filter.luggageFlag) {
      queryBuilder.andWhere('cell_view.luggage_flag = :luggageFlag', { luggageFlag: filter.luggageFlag });
    }

    if (filter.batchNumber) {
      queryBuilder.andWhere('cell_view.batch_number LIKE :batchNumber', { batchNumber: `%${filter.batchNumber}%` });
    }

    if (filter.orderNumber) {
      queryBuilder.andWhere('cell_view.order_number LIKE :orderNumber', { orderNumber: `%${filter.orderNumber}%` });
    }

    if (filter.enable) {
      queryBuilder.andWhere('cell_view.enable = :enable', { enable: filter.enable });
    }

    if (join.joinWarehouse) {
      if (filter.warehouseId) {
        queryBuilder.andWhere('warehouse.id = :warehouseId', { warehouseId: filter.warehouseId });
      }
      if (filter.warehouseType) {
        queryBuilder.andWhere('warehouse.type = :warehouseType', { warehouseType: filter.warehouseType });
      }
    }

    if (filter.InStartDate) {
      queryBuilder.andWhere('cell_view.in_date >= :inStartDate', { inStartDate: filter.InStartDate });
    }

    if (filter.InEndDate) {
      queryBuilder.andWhere('cell_view.in_date <= :inEndDate', { inEndDate: filter.InEndDate });
    }

    if (filter.cellStatus) {
      queryBuilder.andWhere('cell_view.cell_status = :cellStatus', { cellStatus: filter.cellStatus });
    }

    return queryBuilder;
  }

  protected createJoinQueryBuilder(joinPallet: boolean = true, joinWarehouse: boolean = true): SelectQueryBuilder<CellView> {
    const queryBuilder = this.repository.createQueryBuilder('cell_view')
    if (joinPallet) {
      queryBuilder.leftJoinAndSelect('cell_view.pallet', 'pallet');
    }
    if (joinWarehouse) {
      queryBuilder.leftJoinAndSelect('cell_view.warehouse', 'warehouse');
    }
    return queryBuilder;
  };
}