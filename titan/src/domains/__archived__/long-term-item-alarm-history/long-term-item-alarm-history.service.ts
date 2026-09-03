import { Logger, Injectable } from '@nestjs/common';

import { ORDER } from 'src/common/enum/db.enum';
import { CreateAlarmHistoryDto } from '../../alarm/history/alarm-history/dto/request/create-alarm-history.dto';
import { AlarmHistoryService } from '../../alarm/history/alarm-history/alarm-history.service';
import { LongTermItemAlarmHistoryRepository } from './repositories/long-term-item-alarm-history.repository';
import { CreateLongTermItemAlarmHistoryDto } from './dto/request/create-long-term-item-alarm-history.dto';
import { LongTermItemAlarmHistory } from './entities/long-term-item-alarm-history.entity';
import { FilteringLongTermItemAlarmHistoryDto } from './dto/request/filtering-long-term-item-alarm-history.dto';

@Injectable()
export class LongTermItemAlarmHistoryService {
    private readonly logger = new Logger(LongTermItemAlarmHistoryService.name)
    constructor(
    private readonly alarmHistoryService: AlarmHistoryService,
    private readonly repo : LongTermItemAlarmHistoryRepository,
  ) {}

  async createLongTermItemAlarmHistory(createDto : CreateLongTermItemAlarmHistoryDto) : Promise<LongTermItemAlarmHistory>{
    const createAlarmHistoryDto = createDto as CreateAlarmHistoryDto;
    const alarmHistory = await this.alarmHistoryService.createAlarmHistory(createAlarmHistoryDto)
    const ltiAlarmHistory = await this.repo.createLongTermItemAlarmHistory(alarmHistory, createDto);
    return ltiAlarmHistory;
    
  }

  async getFilteredEntities(filter : FilteringLongTermItemAlarmHistoryDto): Promise<LongTermItemAlarmHistory[]> {
    const entityList = await this.repo.getFilteredList({filter: filter, orderByCreateDate: ORDER.DESC});
    return entityList;
  };

  async getFilteredLimitEntities(limit: number, filter : FilteringLongTermItemAlarmHistoryDto): Promise<LongTermItemAlarmHistory[]> {
    const entityList = await this.repo.getFilteredLimit(limit, {filter: filter, orderByCreateDate: ORDER.DESC});
    return entityList;
  };
};