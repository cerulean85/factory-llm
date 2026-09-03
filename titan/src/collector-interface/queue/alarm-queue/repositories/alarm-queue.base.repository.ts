import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder  } from 'typeorm';

import { AlarmQueue } from '../entities/alarm-queue.entity';
import { ORDER } from 'src/common/enum/db.enum';
import { Pagination } from 'src/utils/pagination.util';
import { BaseRepositoryContract } from 'src/common/repository/base-repository-contract';

export interface IAlarmQueueQueryOptions {
  orderMap?: Partial<Record<AlarmQueueOrderKey, ORDER>>;
}

export enum AlarmQueueOrderKey {
  ID = 'alarm_queue.id',
  CREATE_DATE = 'alarm_queue.create_date'
}

@Injectable()
export abstract class AlarmQueueBaseRepository extends BaseRepositoryContract<AlarmQueue, IAlarmQueueQueryOptions> {
  constructor(
    @InjectRepository(AlarmQueue)
    protected readonly repository: Repository<AlarmQueue>,
    protected readonly pagination: Pagination
  ) {super(repository, pagination);}

  protected initializeDefaultOptions(
    options: IAlarmQueueQueryOptions = {}
  ): Required<IAlarmQueueQueryOptions> {
    return {
      orderMap: options.orderMap ?? {},
    };
  }

  protected createQueryBuilder(
    options: IAlarmQueueQueryOptions
  ): SelectQueryBuilder<AlarmQueue> {
    const { orderMap } = this.initializeDefaultOptions(options);
    const queryBuilder = this.createJoinQueryBuilder();
    const orderedQb = this.makeOrderedQueryBuilder(queryBuilder, orderMap);
    return orderedQb;
  }

  protected createJoinQueryBuilder(): SelectQueryBuilder<AlarmQueue> {
    const queryBuilder = this.repository
      .createQueryBuilder('alarm_queue')
      .leftJoinAndSelect('alarm_queue.alarm', 'alarm')
      .leftJoinAndSelect('alarm_queue.equipment', 'equipment')
      .leftJoinAndSelect('equipment.equipment_type', 'equipment_type')
      .select([
        'alarm_queue.id',
        'alarm_queue.create_date',
        'alarm_queue.process_status',
        'alarm.id',
        'alarm.code',
        'alarm.type',
        'alarm.description',
        'alarm.importance',
        'alarm.create_date',
        'alarm.update_date',
        'alarm.process_method',
        'alarm.file_id_list',
        'alarm.send_enabled',
        'equipment.id',
        'equipment.name',
        'equipment.code',
        'equipment_type.id',
        'equipment_type.type',
      ])
    return queryBuilder;
  }

  protected makeFilteredQueryBuilder(
    queryBuilder: SelectQueryBuilder<AlarmQueue>,
  ): SelectQueryBuilder<AlarmQueue> {
    return queryBuilder;
  }
}