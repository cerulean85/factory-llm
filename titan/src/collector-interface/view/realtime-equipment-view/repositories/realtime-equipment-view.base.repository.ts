import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { ORDER } from 'src/common/enum/db.enum';
import { RealtimeEquipmentView } from '../entities/realtime-equipment-view.entity';
import { FilteringRealtimeEquipmentViewDto } from '../dto/request/filtering-realtime-equipment-view.dto';
import { BaseRepositoryContract } from 'src/common/repository/base-repository-contract';
import { Pagination } from 'src/utils/pagination.util';

export interface IRealtimeEquipmentViewQueryOptions {
  filter?: FilteringRealtimeEquipmentViewDto;
  joinEquipment?: boolean;
  orderMap?: Partial<Record<RealtimeEquipmentViewOrderKey, ORDER>>;
}

export enum RealtimeEquipmentViewOrderKey {
  ID = 'realtime_equipment_view.id',
}

@Injectable()
export abstract class RealtimeEquipmentViewBaseRepository extends BaseRepositoryContract<RealtimeEquipmentView, IRealtimeEquipmentViewQueryOptions> {
  constructor(
    @InjectRepository(RealtimeEquipmentView)
    protected readonly repository: Repository<RealtimeEquipmentView>,
    protected readonly pagination: Pagination
  ) {super(repository, pagination);}

  protected initializeDefaultOptions(
    options: IRealtimeEquipmentViewQueryOptions= {}
  ): Required<IRealtimeEquipmentViewQueryOptions> {
    return {
      filter: options.filter ?? new FilteringRealtimeEquipmentViewDto(),
      joinEquipment: options.joinEquipment ?? true,
      orderMap: options.orderMap ?? {},
    };
  }

  protected createQueryBuilder(
    options: IRealtimeEquipmentViewQueryOptions
  ): SelectQueryBuilder<RealtimeEquipmentView> {
    const { filter, joinEquipment, orderMap } = this.initializeDefaultOptions(options);
    const queryBuilder = this.createJoinQueryBuilder(joinEquipment);
    const filteredQb = this.makeFilteredQueryBuilder(queryBuilder, filter, joinEquipment);
    const orderedQb = this.makeOrderedQueryBuilder(filteredQb, orderMap);
    return orderedQb;
  }

  protected makeFilteredQueryBuilder(queryBuilder: SelectQueryBuilder<RealtimeEquipmentView>, filter: FilteringRealtimeEquipmentViewDto, joinEquipment: boolean): SelectQueryBuilder<RealtimeEquipmentView> {
    //Realtime View ID 필터링
    if (filter.id) {
      queryBuilder.andWhere('realtime_equipment_view.id = :id', { id: filter.id });
    }

    //장비 ID 필터링
    if (joinEquipment) {
      if (filter.equipmentId) {
        queryBuilder.andWhere('equipment.id = :equipmentId', { equipmentId: filter.equipmentId });
      }
    }
    //현재 상태 필터링
    if (filter.status) {
      queryBuilder.andWhere('realtime_equipment_view.status = :status', { status: filter.status });
    }    
    if (filter.taskType) {
      queryBuilder.andWhere('realtime_equipment_view.task_type = :taskType', { taskType: filter.taskType });
    }
    if (filter.actionType) {
      queryBuilder.andWhere('realtime_equipment_view.action_type = :actionType', { actionType: filter.actionType });
    }
    return queryBuilder;
  }

  protected createJoinQueryBuilder(joinEquipment: boolean): SelectQueryBuilder<RealtimeEquipmentView> {
    const queryBuilder = this.repository.createQueryBuilder('realtime_equipment_view')

    if (joinEquipment) {
      queryBuilder.leftJoinAndSelect('realtime_equipment_view.equipment', 'equipment');
      queryBuilder.leftJoinAndSelect('equipment.equipment_type', 'equipment_type');
    }

    queryBuilder
      .select([
        'realtime_equipment_view.id',
        'realtime_equipment_view.speed',
        'realtime_equipment_view.status',
        'realtime_equipment_view.loc_x',
        'realtime_equipment_view.loc_y',
        'realtime_equipment_view.loc_z',
        'realtime_equipment_view.task_type',
        'realtime_equipment_view.standard_type',
        'realtime_equipment_view.st_count',
        'realtime_equipment_view.create_date',
        'realtime_equipment_view.twin_status',
        'realtime_equipment_view.loaded',
        'realtime_equipment_view.action_type',
        ...(joinEquipment ? [
          'equipment.id',
          'equipment.name',
          'equipment.code',
          'equipment_type.id',
          'equipment_type.name',
        ] : []),
      ]);

    return queryBuilder;
  };
}