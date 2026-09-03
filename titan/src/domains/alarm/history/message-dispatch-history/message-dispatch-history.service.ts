import { Logger, Injectable, NotFoundException } from '@nestjs/common';

import { UsersService } from '../../../users/users/users.service';
import { MessageDispatchHistoryRepository } from './repositories/message-dispatch-history.repository';
import { CreateMessageDispatchHistoryDto } from './dto/request/create-message-dispatch-history.dto';
import { MessageDispatchHistory } from './entities/message-dispatch-history.entity';
import { FilteringMessageDispatchHistoryDto } from './dto/request/filtering-message-dispatch-history.dto';
import { AlarmHistory } from '../alarm-history/entities/alarm-history.entity';
import { AlarmHistoryService } from '../alarm-history/alarm-history.service';
import { FilteringAlarmHistoryDto } from '../alarm-history/dto/request/filtering-alarm-history.dto';

@Injectable()
export class MessageDispatchHistoryService {
    private readonly logger = new Logger(MessageDispatchHistoryService.name)
    constructor(
    private readonly repo: MessageDispatchHistoryRepository,
    private readonly usersService: UsersService,
    private readonly alarmHistoryService: AlarmHistoryService,
  ) {}
  
  async createMessageDispatchHistory(createDto: CreateMessageDispatchHistoryDto) : Promise<MessageDispatchHistory> {
    const { users_seq_id: usersSeqId, alarm_history_id: alarmHistoryId } = createDto;
    const users = await this.usersService.findUsersEntityBySeqId(usersSeqId);
    if (!users) {
      this.logger.warn(`User with ID ${usersSeqId} not found`);
      throw new NotFoundException(`User with ID ${usersSeqId} not found`);
    }
    const filter = new FilteringAlarmHistoryDto();
    filter.alarmHistoryId = alarmHistoryId;

    const alarmHistoryList = await this.alarmHistoryService.getFilteredList(filter);
    if(alarmHistoryList.length <= 0 ){
      this.logger.warn(`AlarmHistory not found`);
      throw new NotFoundException(`AlarmHistory not found`);
    }

    const alarmHistory = new AlarmHistory(); 
    alarmHistory.id = alarmHistoryList[0].alarmHistory.alarmHistoryId;

    const newData = await this.repo.create(alarmHistory, users, createDto);
    return newData;
  };

  async filterMessageDispatchHistory(filteringDto: FilteringMessageDispatchHistoryDto) {
    const mdhPageList = await this.repo.getFilteredPaginatedList({ filter: filteringDto });
    return mdhPageList
    //const rstList =  plainToInstance(MessageDispatchHistoryResponseDto, mdhList, { excludeExtraneousValues: true });
    //return rstList;
  };
};