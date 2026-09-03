import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Users } from 'src/domains/users/users/entities/users.entity';

import { Pagination } from 'src/utils/pagination.util';
import { MessageDispatchHistory } from '../entities/message-dispatch-history.entity';
import { CreateMessageDispatchHistoryDto } from '../dto/request/create-message-dispatch-history.dto';
import { AlarmHistory } from 'src/domains/alarm/history/alarm-history/entities/alarm-history.entity';
import { MessageDispatchHistoryBaseRepository } from './message-dispatch-history.base.repository';

@Injectable()
export class MessageDispatchHistoryRepository extends MessageDispatchHistoryBaseRepository{
  constructor(
    @InjectRepository(MessageDispatchHistory)
    repository: Repository<MessageDispatchHistory>,
    pagination: Pagination,
  ) {super(repository, pagination);}

  async create(alarmHistory: AlarmHistory, users: Users, createDto?: CreateMessageDispatchHistoryDto): Promise<MessageDispatchHistory> {
    const newData = this.repository.create({
      alarm_history: alarmHistory,
      users: users,
      ...createDto});
    return await this.repository.save(newData);
  }
}