import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository, SelectQueryBuilder, Transaction } from 'typeorm';
import { AlarmUserRelation } from '../entities/alarm-user-relation.entity';
import { Pagination } from 'src/utils/pagination.util';
import { BaseRepositoryContract } from 'src/common/repository/base-repository-contract';
import { FilteringAlarmUserRelationDto } from '../dto/filtering-alarm-user-relation.dto';
import { ORDER } from 'src/common/enum/db.enum';

export interface IAlarmUserRelationQueryOptions {
  filter?: FilteringAlarmUserRelationDto;
  joinUsers?: boolean;
  joinAlarm?: boolean;
  orderMap?: Partial<Record<AlarmUserRelationOrderKey, ORDER>>;
}

export enum AlarmUserRelationOrderKey {
  ID = 'alarm_user_relation.id'
}

@Injectable()
export abstract class AlarmUserRelationBaseRepository extends BaseRepositoryContract<AlarmUserRelation, IAlarmUserRelationQueryOptions> {
  constructor(
    @InjectRepository(AlarmUserRelation)
    repository: Repository<AlarmUserRelation>,
    pagination: Pagination,
  ) {super(repository, pagination);}

  protected initializeDefaultOptions(
    options: IAlarmUserRelationQueryOptions= {}
  ): Required<IAlarmUserRelationQueryOptions> {
    return {
      filter: options.filter ?? new FilteringAlarmUserRelationDto(),
      joinUsers: options.joinUsers ?? true,
      joinAlarm: options.joinAlarm ?? true,
      orderMap: options.orderMap ?? {},
    };
  }

  protected createQueryBuilder(
    options: IAlarmUserRelationQueryOptions
  ): SelectQueryBuilder<AlarmUserRelation>
  {
    const { filter, joinUsers, joinAlarm, orderMap } = this.initializeDefaultOptions(options);
    const queryBuilder = this.createJoinQueryBuilder(joinUsers, joinAlarm);
    const filteredQb = this.makeFilteredQueryBuilder(queryBuilder, filter, { joinUsers, joinAlarm });
    const orderedQb = this.makeOrderedQueryBuilder(filteredQb, orderMap);
    return orderedQb;
  }

  protected createJoinQueryBuilder(joinUsers: boolean = true, joinAlarm: boolean = true): SelectQueryBuilder<AlarmUserRelation> {
    const queryBuilder = this.repository.createQueryBuilder('alarm_user_relation')

    if (joinUsers) {
      queryBuilder
        .leftJoinAndSelect('alarm_user_relation.users', 'users')
    }
    if (joinAlarm) {
      queryBuilder
        .leftJoinAndSelect('alarm_user_relation.alarm', 'alarm')
    }

    queryBuilder
    .select([
      'alarm_user_relation.id',

      ...(joinUsers ? [
      'users.seq_id',
      ] : []),
      
      ...(joinAlarm ? [
        'alarm.id',
      ] : []),
    ]);
    return queryBuilder;
  }

  protected makeFilteredQueryBuilder(
    queryBuilder: SelectQueryBuilder<AlarmUserRelation>,
    filter: FilteringAlarmUserRelationDto,
    join?: { joinUsers?: boolean, joinAlarm?: boolean }
  ): SelectQueryBuilder<AlarmUserRelation> {
    if (filter.id) {
      queryBuilder.andWhere('alarm_user_relation.id = :id', { id: filter.id });
    }
    if (join?.joinAlarm && filter.alarmId) {
      queryBuilder.andWhere('alarm.id = :alarmId', { alarmId: filter.alarmId });
    }
    if (join?.joinUsers && filter.userSeqId) {
      queryBuilder.andWhere('users.seq_id = :userSeqId', { userSeqId: filter.userSeqId });
    }
    return queryBuilder;
  }
}