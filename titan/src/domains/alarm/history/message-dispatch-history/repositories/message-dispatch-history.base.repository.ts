import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Pagination } from 'src/utils/pagination.util';
import { MessageDispatchHistory } from '../entities/message-dispatch-history.entity';
import { FilteringMessageDispatchHistoryDto } from '../dto/request/filtering-message-dispatch-history.dto';
import { ORDER } from 'src/common/enum/db.enum';
import { BaseRepositoryContract } from 'src/common/repository/base-repository-contract';

export interface IMessageDispatchHistoryQueryOptions {
  filter?: FilteringMessageDispatchHistoryDto;
  joinAlarmHistory?: boolean;
  joinUsers?: boolean;
  orderMap?: Partial<Record<MessageDispatchHistoryOrderKey, ORDER>>;
}

export enum MessageDispatchHistoryOrderKey {
  ID = 'message_dispatch_history.id',
  CREATE_DATE = 'message_dispatch_history.create_date',
}

@Injectable()
export abstract class MessageDispatchHistoryBaseRepository extends BaseRepositoryContract<MessageDispatchHistory, IMessageDispatchHistoryQueryOptions> {
  constructor(
    @InjectRepository(MessageDispatchHistory)
    protected readonly repository: Repository<MessageDispatchHistory>,
    protected readonly pagination: Pagination,
  ) {super(repository, pagination);}

  protected initializeDefaultOptions(
    options: IMessageDispatchHistoryQueryOptions = {}
  ): Required<IMessageDispatchHistoryQueryOptions> {
    return {
      filter: options.filter ?? new FilteringMessageDispatchHistoryDto(),
      joinAlarmHistory: options.joinAlarmHistory ?? true,
      joinUsers: options.joinUsers ?? true,
      orderMap: options.orderMap ?? {},
    };
  }

  protected createQueryBuilder(
    options: IMessageDispatchHistoryQueryOptions
  ): SelectQueryBuilder<MessageDispatchHistory> {
    const { filter, joinAlarmHistory, joinUsers, orderMap } = this.initializeDefaultOptions(options);
    const queryBuilder = this.createJoinQueryBuilder(joinAlarmHistory, joinUsers);
    const filteredQb = this.makeFilteredQueryBuilder(queryBuilder, filter, joinAlarmHistory);
    const orderedQb = this.makeOrderedQueryBuilder(filteredQb, orderMap);
    return orderedQb;
  }

  protected createJoinQueryBuilder(joinAlarmHistory: boolean = true, joinUsers: boolean = true): SelectQueryBuilder<MessageDispatchHistory> {
    const queryBuilder = this.repository.createQueryBuilder('message_dispatch_history')

    if (joinAlarmHistory) {
      queryBuilder
      .leftJoinAndSelect('message_dispatch_history.alarm_history', 'alarm_history')
    };

    if (joinUsers) {
      queryBuilder
      .leftJoinAndSelect('message_dispatch_history.users', 'users')
    };
    
    queryBuilder
    .select([
      'message_dispatch_history.id',
      'message_dispatch_history.type',
      'message_dispatch_history.message',
      'message_dispatch_history.dispatch_success',
      'message_dispatch_history.create_date',

      ...(joinAlarmHistory ? [
        'alarm_history.id',
        'alarm_history.message',
        'alarm_history.process_date',
        'alarm_history.process_message',
      ] : []),

      ...(joinUsers ? [
        'users.seq_id',
        'users.user_id',
        'users.name',
      ] : []),
    ]);

    return queryBuilder;
  }

  protected makeFilteredQueryBuilder(
    queryBuilder: SelectQueryBuilder<MessageDispatchHistory>,
    filter: FilteringMessageDispatchHistoryDto,
    joinAlarmHistory?: boolean,
  ): SelectQueryBuilder<MessageDispatchHistory> {
    if (filter.id) {
      queryBuilder.andWhere('message_dispatch_history.id = :id', { id: filter.id });
    }

    if (joinAlarmHistory && filter.alarmHistoryId) {
      queryBuilder.andWhere('alarm_history.id = :alarmHistoryId', { alarmHistoryId: filter.alarmHistoryId });
    }

    return queryBuilder;
  }
}