import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Pagination } from 'src/utils/pagination.util';
import { AlarmHistoryProcessByUser } from '../entities/alarm-history-process-by-user.entity';
import { ORDER } from 'src/common/enum/db.enum';
import { FilteringAlarmHistoryProcessByUserDto } from '../dto/filtering-alarm-history-process-by-user.dto';
import { BaseRepositoryContract } from 'src/common/repository/base-repository-contract';

export interface IAlarmHistoryProcessByUserQueryOptions {
  filter?: FilteringAlarmHistoryProcessByUserDto;
  joinUsers?: boolean;
  joinAlarmHistory?: boolean;
  orderMap?: Partial<Record<AlarmHistoryProcessByUserOrderKey, ORDER>>;
}

export enum AlarmHistoryProcessByUserOrderKey {
  ID = 'alarm_history_process_by_user.id',
}

@Injectable()
export abstract class AlarmHistoryProcessByUserBaseRepository extends BaseRepositoryContract<AlarmHistoryProcessByUser, IAlarmHistoryProcessByUserQueryOptions> {
  constructor(
    @InjectRepository(AlarmHistoryProcessByUser)
    protected readonly repository: Repository<AlarmHistoryProcessByUser>,
    protected readonly pagination : Pagination,
  ) {super(repository, pagination);}

  protected initializeDefaultOptions(
    options: IAlarmHistoryProcessByUserQueryOptions = {}
  ): Required<IAlarmHistoryProcessByUserQueryOptions> {
    return {
      filter: options.filter ?? new FilteringAlarmHistoryProcessByUserDto(),
      joinUsers: options.joinUsers ?? true,
      joinAlarmHistory: options.joinAlarmHistory ?? true,
      orderMap: options.orderMap ?? {},
    };
  }

  protected createQueryBuilder(
    options: IAlarmHistoryProcessByUserQueryOptions
  ): SelectQueryBuilder<AlarmHistoryProcessByUser> {
    const { filter, joinUsers, joinAlarmHistory, orderMap } = this.initializeDefaultOptions(options);
    const queryBuilder = this.createJoinQueryBuilder(joinUsers, joinAlarmHistory);
    const filteredQb = this.makeFilteredQueryBuilder(queryBuilder, filter, { joinUsers, joinAlarmHistory });
    const orderedQb = this.makeOrderedQueryBuilder(filteredQb, orderMap);
    return orderedQb;
  }

  protected createJoinQueryBuilder(joinUsers: boolean = true, joinAlarmHistory: boolean = true): SelectQueryBuilder<AlarmHistoryProcessByUser> {
    const queryBuilder = this.repository.createQueryBuilder('alarm_history_process_by_user')

    if (joinUsers) {
      queryBuilder
      .leftJoinAndSelect('alarm_history_process_by_user.users', 'users')
    };

    if (joinAlarmHistory) {
      queryBuilder
      .leftJoinAndSelect('alarm_history_process_by_user.alarm_history', 'alarm_history')
    };
    
    queryBuilder
    .select([
      'alarm_history_process_by_user.id',

      ...(joinUsers ? [
        'users.seq_id',
      ] : []),

      ...(joinAlarmHistory ? [
        'alarm_history.id',
      ] : []),
    ]);

    return queryBuilder;
  }

  protected makeFilteredQueryBuilder(
    queryBuilder: SelectQueryBuilder<AlarmHistoryProcessByUser>,
    filter: FilteringAlarmHistoryProcessByUserDto,
    join?: { joinUsers?: boolean, joinAlarmHistory?: boolean },
  ): SelectQueryBuilder<AlarmHistoryProcessByUser> {
    if (join?.joinAlarmHistory && filter.alarmHistoryId) {
      queryBuilder.andWhere('alarm_history.id = :alarmHistoryId', { alarmHistoryId: filter.alarmHistoryId });
    }

    if (join?.joinUsers && filter.userSeqId) {
      queryBuilder.andWhere('users.seq_id = :userSeqId', { userSeqId: filter.userSeqId });
    }

    return queryBuilder;
  }
}