import { Logger, Injectable, NotFoundException, Inject, forwardRef } from '@nestjs/common';

import { AlarmHistoryRepository } from './repositories/alarm-history.repository';
import { AlarmHistory } from './entities/alarm-history.entity';

import { FilteringAlarmHistoryDto } from './dto/request/filtering-alarm-history.dto';
import { ORDER } from 'src/common/enum/db.enum';
import { CreateAlarmHistoryDto } from './dto/request/create-alarm-history.dto';
import { Transactional } from 'typeorm-transactional';
import { AlarmHistoryProcessByUserService } from '../alarm-history-process-by-user/alarm-history-process-by-user.service';
import { AssignUsersToAlarmHistoryDto } from '../alarm-history-process-by-user/dto/assign-users-to-alarm-history.dto';
import { UpdateProcessAlarmHistoryDto } from './dto/request/update-process-alarm-history.dto';
import { AlarmProcessDailyStatisticsDto, DailyAlarmProcessStatusDto } from './sub-domain/equipment-alarm-history/dto/response/alarm-process-daily-statistics.dto';
import { GettingAlarmHistoryStatisticsDto } from './dto/request/getting-alarm-history-statistics.dto';
import { AlarmHistoryStatsRepository } from './repositories/alarm-history.stats.repository';
import { AlarmHistoryBaseOrderKey } from './repositories/alarm-history.base.repository';
import { AggregatedAlarmHistoryResponseDto } from './dto/response/aggregated-alarm-history-response.dto';
import { plainToInstance } from 'class-transformer';
import { PaginationResponseDto } from 'src/common/dto/pagination-response.dto';
import { Pagination } from 'src/utils/pagination.util';
import { ResponseStatusDto } from 'src/common/dto/response-status.dto';
import { FileService } from 'src/core/file/file.service';

@Injectable()
export class AlarmHistoryService {
    private readonly logger = new Logger(AlarmHistoryService.name)
    constructor(
    private readonly alarmHistoryRepository: AlarmHistoryRepository,
    private readonly ahsRepository: AlarmHistoryStatsRepository,
    private readonly fileService: FileService,

    @Inject(forwardRef(() => AlarmHistoryProcessByUserService))
    private readonly relationService: AlarmHistoryProcessByUserService,
  ) {}

  async createAlarmHistory(createDto : CreateAlarmHistoryDto) : Promise<AlarmHistory>{
    const alarmHistory = await this.alarmHistoryRepository.createAlarmHistory(createDto)
    return alarmHistory;
  }

  async insertAlarmHistory(alarmHistory: AlarmHistory): Promise<AlarmHistory> {
    const rstList = await this.alarmHistoryRepository.insertAlarmHistory(alarmHistory)
    return rstList;
  }

  async insertAlarmHistoryList(alarmHistoryList: AlarmHistory[]): Promise<AlarmHistory[]> {
    const rstList = await this.alarmHistoryRepository.insertAlarmHistoryList(alarmHistoryList)
    return rstList;
  }


  @Transactional()
  async updateProcessAlarmHistory(alarmHistoryId: number, updateProcessAlarmHistory : UpdateProcessAlarmHistoryDto): Promise<ResponseStatusDto>{
    let {process_message : processMessage, process_date : processDate, user_seq_id_list : processUserSeqList} = updateProcessAlarmHistory

    const result = await this.alarmHistoryRepository.updateProcessMessage(alarmHistoryId, processMessage, processDate);
    if (processUserSeqList && processUserSeqList.length > 0) {
    const assignUsersToAlarmHistoryDto = new AssignUsersToAlarmHistoryDto();
    assignUsersToAlarmHistoryDto.alarmHistoryId = alarmHistoryId;
    assignUsersToAlarmHistoryDto.userSeqIdList = processUserSeqList;
    await this.relationService.createRelationList(assignUsersToAlarmHistoryDto);
    }

    let resStatusDto = new ResponseStatusDto();
    resStatusDto.isSuccess = result;
    resStatusDto.message = result ? 'AlarmHistory updated successfully' : 'Failed to update alarmHistory';
    return resStatusDto;
  };


  async getAlarmHistoryEntityById(alarmHistoryId: number): Promise<AlarmHistory> {
    const filter = new FilteringAlarmHistoryDto();
    filter.alarmHistoryId = alarmHistoryId;
    
    const alarmHistory = await this.alarmHistoryRepository.getFilteredOne({filter:filter});
    if (!alarmHistory) {
      this.logger.warn(`AlarmHistory not found : ${alarmHistoryId}`);
      throw new NotFoundException(`AlarmHistory not found : ${alarmHistoryId}`);
    };
    return alarmHistory;
  };

  async getAlarmHistoryEntitiesByIds(alarmHistoryIds: number[]): Promise<AlarmHistory[]> {
    const alarmHistoryList = await this.alarmHistoryRepository.getFilteredListByIds(alarmHistoryIds);
    return alarmHistoryList;
  };

  async getFilterdPaginatedList(filteringAlarmHistoryDto : FilteringAlarmHistoryDto) {
    const filteredData = await this.alarmHistoryRepository.getFilteredPaginatedList({filter: filteringAlarmHistoryDto, orderMap: {[AlarmHistoryBaseOrderKey.ID]:ORDER.DESC}});

    const result = Pagination.transformPaginatedData(AggregatedAlarmHistoryResponseDto, filteringAlarmHistoryDto, filteredData);
    return result;
  };

  async getFilteredEntities (filteringDto : FilteringAlarmHistoryDto): Promise<AlarmHistory[]> {
    const filteredData = await this.alarmHistoryRepository.getFilteredList({filter:filteringDto});
    return filteredData;
  };

  async getFilteredList (filteringDto : FilteringAlarmHistoryDto): Promise<AggregatedAlarmHistoryResponseDto[]> {
    const filteredData = await this.alarmHistoryRepository.getFilteredList({filter:filteringDto});

  // file 정보가 포함된 새로운 데이터 배열 생성
  const dataWithFile = await Promise.all(
    filteredData.map(async (data) => {
      if (data.equipment_alarm_history?.alarm?.file_id_list) {
        const fileIds = data.equipment_alarm_history.alarm.file_id_list;
        const files = await this.fileService.getFilesByIdList(fileIds);
        
        return {
          ...data,
          equipment_alarm_history: {
            ...data.equipment_alarm_history,
            alarm: {
              ...data.equipment_alarm_history.alarm,
              file_list: files
            }
          }
        };
      }
      return data;
    })
  );
    const result = plainToInstance(AggregatedAlarmHistoryResponseDto, dataWithFile, { excludeExtraneousValues: true });
    return result;
  };

  async getFilteredLimitEntities(limit: number, filter : FilteringAlarmHistoryDto, order : ORDER = ORDER.DEFAULT): Promise<AlarmHistory[]> {
    const entityList = await this.alarmHistoryRepository.getFilteredLimit(limit, {filter: filter, orderMap: {[AlarmHistoryBaseOrderKey.CREATE_DATE]: order}});
    return entityList;
  };
};