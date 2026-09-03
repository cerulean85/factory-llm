import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { CraneCell } from '../entities/crane-cell.entity';
import { ORDER } from 'src/common/enum/db.enum';
import { FilteringCraneCellDto } from '../dto/request/filtering-crane-cell.dto';
import { BaseRepositoryContract } from 'src/common/repository/base-repository-contract';
import { Pagination } from 'src/utils/pagination.util';


export interface ICraneCellQueryOptions {
  filter?: FilteringCraneCellDto;
  joinEquipment?: boolean;
  joinWarehouse?: boolean;
  orderMap?: Partial<Record<CraneCellOrderKey, ORDER>>;
}

export enum CraneCellOrderKey {
  ID = 'crane_cell.id',
  CREATE_DATE = 'crane_cell.create_date',
}

@Injectable()
export abstract class CraneCellBaseRepository extends BaseRepositoryContract<CraneCell, ICraneCellQueryOptions> {
  constructor(
    @InjectRepository(CraneCell)
    protected readonly repository: Repository<CraneCell>,
    protected readonly pagination: Pagination,
  ) {super(repository, pagination);}

  protected initializeDefaultOptions(
    options: ICraneCellQueryOptions= {}
  ): Required<ICraneCellQueryOptions> {
    return {
      filter: options.filter ?? new FilteringCraneCellDto(),
      joinEquipment: options.joinEquipment ?? true,
      joinWarehouse: options.joinWarehouse ?? true,
      orderMap: options.orderMap ?? {},
    };
  }

  protected createQueryBuilder(
    options: ICraneCellQueryOptions
  ): SelectQueryBuilder<CraneCell> {
    const { filter, joinEquipment, joinWarehouse, orderMap } = this.initializeDefaultOptions(options);
    const queryBuilder = this.createJoinQueryBuilder(joinEquipment, joinWarehouse);
    const filteredQb = this.makeFilteredQueryBuilder(queryBuilder, filter, joinEquipment);
    const orderedQb = this.makeOrderedQueryBuilder(filteredQb, orderMap);
    return orderedQb;
  }

  protected makeFilteredQueryBuilder(
    queryBuilder: SelectQueryBuilder<CraneCell>,
    filter: FilteringCraneCellDto,
    joinEquipment: boolean,
  ): SelectQueryBuilder<CraneCell> {
    if (filter.craneCellId) {
      queryBuilder.andWhere('crane_cell.id = :id', { id: filter.craneCellId });
    }
    if (filter.enable !== undefined && filter.enable !== null) {
      queryBuilder.andWhere('crane_cell.enable = :enable', { enable: filter.enable });
    }
    if (joinEquipment) {
      if (filter.equipmentId) {
        queryBuilder.andWhere('equipment.id = :equipmentId', { equipmentId: filter.equipmentId });
      }
    }
    if (filter.bank) {
      queryBuilder.andWhere('crane_cell.bank = :bank', { bank: filter.bank })
    }
    if (filter.bay) {
      queryBuilder.andWhere('crane_cell.bay = :bay', { bay: filter.bay })
    }
    if (filter.level) {
      queryBuilder.andWhere('crane_cell.level = :level', { level: filter.level })
    }
    if (filter.cellStatus) {
      queryBuilder.andWhere('crane_cell.cell_status = :cellStatus', { cellStatus: filter.cellStatus })
    }
    return queryBuilder;
  }

  protected createJoinQueryBuilder(joinEquipment: boolean = true, joinWarehouse: boolean = true): SelectQueryBuilder<CraneCell> {
    const queryBuilder = this.repository.createQueryBuilder('crane_cell')

    if (joinEquipment) {
      queryBuilder
        .leftJoinAndSelect('crane_cell.equipment', 'equipment')
    }

    if (joinWarehouse) {
      queryBuilder.leftJoinAndSelect('equipment.warehouse', 'warehouse')
    }

    queryBuilder
    .select([
      'crane_cell.id',
      'crane_cell.create_date',
      'crane_cell.update_date',
      'crane_cell.bank',
      'crane_cell.bay',
      'crane_cell.level',
      'crane_cell.enable',
      'crane_cell.cell_status',

      ...(joinEquipment ? [
        'equipment.id',
        'equipment.code',
      ] : []),

      ...(joinEquipment && joinWarehouse ? [
        'warehouse.id',
        'warehouse.code',
      ] : []),
    ]);

    return queryBuilder;
  }
}