import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { GantryCell } from '../entities/gantry-cell.entity';
import { FilteringGantryCellDto } from '../dto/request/filtering-gantry-cell.dto';
import { ORDER } from 'src/common/enum/db.enum';
import { BaseRepositoryContract } from 'src/common/repository/base-repository-contract';
import { Pagination } from 'src/utils/pagination.util';


export interface IGantryCellQueryOptions {
  filter?: FilteringGantryCellDto;
  joinEquipment?: boolean;
  joinWarehouse?: boolean;
  orderMap?: Partial<Record<GantryCellOrderKey, ORDER>>;
}

export enum GantryCellOrderKey {
  ID = 'gantry_cell.id',
  CREATE_DATE = 'gantry_cell.create_date',
}

@Injectable()
export abstract class GantryCellBaseRepository extends BaseRepositoryContract<GantryCell, IGantryCellQueryOptions> {
  constructor(
    @InjectRepository(GantryCell)
    protected readonly repository: Repository<GantryCell>,
    protected readonly pagination: Pagination,
  ) {super(repository, pagination);}

  protected initializeDefaultOptions(
    options: IGantryCellQueryOptions= {}
  ): Required<IGantryCellQueryOptions> {
    return {
      filter: options.filter ?? new FilteringGantryCellDto(),
      joinEquipment: options.joinEquipment ?? true,
      joinWarehouse: options.joinWarehouse ?? true,
      orderMap: options.orderMap ?? {},
    };
  }

  protected createQueryBuilder(
    options: IGantryCellQueryOptions
  ): SelectQueryBuilder<GantryCell> {
    const { filter, joinEquipment, joinWarehouse, orderMap } = this.initializeDefaultOptions(options);
    const queryBuilder = this.createJoinQueryBuilder(joinEquipment, joinWarehouse);
    const filteredQb = this.makeFilteredQueryBuilder(queryBuilder, filter, joinEquipment);
    const orderedQb = this.makeOrderedQueryBuilder(filteredQb, orderMap);
    return orderedQb;
  }

  protected makeFilteredQueryBuilder(
    queryBuilder: SelectQueryBuilder<GantryCell>,
    filter: FilteringGantryCellDto,
    joinEquipment: boolean,
  ): SelectQueryBuilder<GantryCell> {
    if (filter.gantryCellId) {
      queryBuilder.andWhere('gantry_cell.id = :id', { id: filter.gantryCellId });
    }

    if (joinEquipment) {
      if (filter.equipmentId) {
        queryBuilder.andWhere('equipment.id = :equipmentId', { equipmentId: filter.equipmentId });
      }
    }
    if (filter.enable !== undefined && filter.enable !== null) {
      queryBuilder.andWhere('gantry_cell.enable = :enable', { enable: filter.enable })
    }
    if (filter.bank) {
      queryBuilder.andWhere('gantry_cell.bank = :bank', { bank: filter.bank })
    }
    if (filter.bay) {
      queryBuilder.andWhere('gantry_cell.bay = :bay', { bay: filter.bay })
    }
    if (filter.port) {
      queryBuilder.andWhere('gantry_cell.port = :port', { port: filter.port })
    }
    if (filter.cellStatus) {
      queryBuilder.andWhere('gantry_cell.cell_status = :cellStatus', { cellStatus: filter.cellStatus })
    }
    return queryBuilder;
  }

  protected createJoinQueryBuilder(joinEquipment: boolean = true, joinWarehouse: boolean = true): SelectQueryBuilder<GantryCell> {
    const queryBuilder = this.repository.createQueryBuilder('gantry_cell')

    if (joinEquipment) {
      queryBuilder
        .leftJoinAndSelect('gantry_cell.equipment', 'equipment')
    }

    if (joinWarehouse) {
      queryBuilder.leftJoinAndSelect('equipment.warehouse', 'warehouse')
    }

    queryBuilder    
    .select([
      'gantry_cell.id',
      'gantry_cell.create_date',
      'gantry_cell.update_date',
      'gantry_cell.port',
      'gantry_cell.bank',
      'gantry_cell.bay',
      'gantry_cell.enable',
      'gantry_cell.cell_status',
      
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
  };
};