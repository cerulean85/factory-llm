import { Logger, Injectable, NotFoundException } from '@nestjs/common';

import { CreateEquipmentAlarmHistoryDto } from './dto/request/create-equipment-alarm-history.dto';
import { EquipmentAlarmHistory } from './entities/equipment-alarm-history.entity';
import { CreateAlarmHistoryDto } from '../../dto/request/create-alarm-history.dto';
import { AlarmService } from '../../../../alarm/alarm.service';
import { AlarmHistoryService } from '../../alarm-history.service';
import { AlarmQueue } from 'src/collector-interface/queue/alarm-queue/entities/alarm-queue.entity';
import { AlarmHistory } from '../../entities/alarm-history.entity';
import { FilteringDateDto } from 'src/common/dto/filtering-date.dto';
import { EquipmentAlarmHistoryStatsRepository } from './repositories/equipment-alarm-history.stats.repository';
import { GettingAlarmHistoryStatisticsDto } from '../../dto/request/getting-alarm-history-statistics.dto';
import { EquipmentAlarmHistoryRepository } from './repositories/equipment-alarm-history.repository';
import { EquipmentUnitDto, TopAlarmResponseByEquipmentDto } from './dto/response/top-alarm-response-by-equipment.dto';
import { AlarmProcessEquipmentStatisticsDto, EquipmentAlarmProcessStatusDto } from './dto/response/alarm-process-equipment-statistics.dto';
import { FilteringAlarmHistoryDto } from '../../dto/request/filtering-alarm-history.dto';
import { AlarmProcessDailyStatisticsDto, DailyAlarmProcessStatusDto } from './dto/response/alarm-process-daily-statistics.dto';
import { ALARM_HISTORY_TYPE } from 'src/common/enum/alarm.enum';

@Injectable()
export class EquipmentAlarmHistoryService {
    private readonly logger = new Logger(EquipmentAlarmHistoryService.name)
    constructor(
    private readonly alarmHistoryService: AlarmHistoryService,
    private readonly eahRepository: EquipmentAlarmHistoryRepository,
    private readonly eahStatsRepository : EquipmentAlarmHistoryStatsRepository,
    private readonly alarmService : AlarmService,
  ) {}

  async createEquipmentAlarmHistory(createDto : CreateEquipmentAlarmHistoryDto) : Promise<EquipmentAlarmHistory>{
    const createAlarmHistoryDto = createDto as CreateAlarmHistoryDto;
    createAlarmHistoryDto.type = ALARM_HISTORY_TYPE.EQUIPMENT;
    const alarmHistory = await this.alarmHistoryService.createAlarmHistory(createAlarmHistoryDto)
    const alarm = await this.alarmService.getAlarmEntityById(createDto.alarm_id);
    const equipmentAlarmHistory = await this.eahRepository.createEquipmentAlarmHistory(alarm, alarmHistory, createDto);
    return equipmentAlarmHistory;
  }

  async getEquipmentAlarmHistoryEntityById(equipmentAlarmHistoryId: number): Promise<EquipmentAlarmHistory | null> {
    const equipmentAlarmHistory = await this.eahRepository.getEquipmentAlarmHistoryById(equipmentAlarmHistoryId);
    return equipmentAlarmHistory;
  }

  async insertHistoryListByAlarmQueue(alarmQueueList: AlarmQueue[]): Promise<EquipmentAlarmHistory[]> {
    const equipmentAlarmHistoryList: EquipmentAlarmHistory[] = [];
    for (const alarmQueue of alarmQueueList ) {
      const alarmHistory = new AlarmHistory();
      
      alarmHistory.create_date = alarmQueue.create_date;
      if(alarmQueue.process_status === 0){
        alarmHistory.process_date = alarmQueue.create_date;
      }
      alarmHistory.message = alarmQueue.alarm.description;
      alarmHistory.type = ALARM_HISTORY_TYPE.EQUIPMENT;
      const newAlarmHistory = await this.alarmHistoryService.insertAlarmHistory(alarmHistory);

      const newEquipmentAlarmHistoryDto = new CreateEquipmentAlarmHistoryDto();
      newEquipmentAlarmHistoryDto.alarm_id = alarmQueue.alarm.id;
      newEquipmentAlarmHistoryDto.equipment_name = alarmQueue.equipment.name;
      newEquipmentAlarmHistoryDto.equipment_code = alarmQueue.equipment.code;

      const newEquipmentAlarmHistory = await this.eahRepository.createEquipmentAlarmHistory(alarmQueue.alarm, newAlarmHistory, newEquipmentAlarmHistoryDto);
      equipmentAlarmHistoryList.push(newEquipmentAlarmHistory);
    }
    return equipmentAlarmHistoryList;
  }

  async insertHistoryByAlarmQueue(alarmQueue: AlarmQueue): Promise<EquipmentAlarmHistory> {
    const alarmHistory = new AlarmHistory();
    alarmHistory.create_date = alarmQueue.create_date;
    if(alarmQueue.process_status === 0){
      alarmHistory.process_date = alarmQueue.create_date;
    }
    alarmHistory.message = alarmQueue.alarm.description;
    alarmHistory.type = ALARM_HISTORY_TYPE.EQUIPMENT;
    const newAlarmHistory = await this.alarmHistoryService.insertAlarmHistory(alarmHistory);

    const newEquipmentAlarmHistoryDto = new CreateEquipmentAlarmHistoryDto();
    newEquipmentAlarmHistoryDto.alarm_id = alarmQueue.alarm.id;
    newEquipmentAlarmHistoryDto.equipment_name = alarmQueue.equipment.name;
    newEquipmentAlarmHistoryDto.equipment_code = alarmQueue.equipment.code;
    
    const newEquipmentAlarmHistory = await this.eahRepository.createEquipmentAlarmHistory(alarmQueue.alarm, newAlarmHistory, newEquipmentAlarmHistoryDto);
    return newEquipmentAlarmHistory;
  }

  async getEquipmentAlarmProcessStatisticsByDay(dateStatusDto : GettingAlarmHistoryStatisticsDto): Promise<AlarmProcessDailyStatisticsDto> {
    const groupedDayStatsList = await this.eahStatsRepository.getEquipmentAlarmStatsGroupedByDate(dateStatusDto.startDate, dateStatusDto.endDate)
    const apdsDto = new AlarmProcessDailyStatisticsDto();
    apdsDto.data = [] as DailyAlarmProcessStatusDto[];
    groupedDayStatsList.forEach(element => {
      const status = new DailyAlarmProcessStatusDto();
      status.date = element.date;
      status.dayProcessCount = element.day_process_count;
      status.dayTotalCount = element.day_total_count;
      status.dayProcessRate = element.day_process_rate;
      apdsDto.processCount += element.day_process_count;
      apdsDto.totalCount += element.day_total_count;
      apdsDto.data.push(status);
    });

    if (apdsDto.totalCount === 0) {
      apdsDto.processRate = 0;
    } else {
      apdsDto.processRate = (apdsDto.processCount / apdsDto.totalCount) * 100;
    }

    return apdsDto;
  }
  


  async getAlarmProcessStatisticsByEquipment(dateStatusDto : GettingAlarmHistoryStatisticsDto): Promise<AlarmProcessEquipmentStatisticsDto> {
    const groupedEquipStatsList = await this.eahStatsRepository.getAlarmStatsGroupedByEquipment(dateStatusDto.startDate, dateStatusDto.endDate)
    const apesDto = new AlarmProcessEquipmentStatisticsDto();
    apesDto.data = [] as EquipmentAlarmProcessStatusDto[];
    groupedEquipStatsList.forEach(element => {
      const status = new EquipmentAlarmProcessStatusDto();
      status.equipmentName = element.equipment_name;
      status.equipmentProcessCount = element.process_count;
      status.equipmentTotalCount = element.total_count;
      status.equipmentProcessRate = element.process_rate;
      apesDto.totalCount += element.total_count;
      apesDto.processCount += element.process_count;
      apesDto.data.push(status);
    });

    if (apesDto.totalCount === 0) {
      apesDto.processRate = 0;
    } else {
      apesDto.processRate = (apesDto.processCount / apesDto.totalCount) * 100;
    }

    return apesDto;

  }

  // 설비별 상위 알람 N개 조회
  async getTopAlarmListByEquipment(limit: number, filterDateDto: FilteringDateDto): Promise<TopAlarmResponseByEquipmentDto[]> {
    // 알람 내역 조회
    const filterDto = new FilteringAlarmHistoryDto();
    filterDto.alarmStartDate = filterDateDto.startDate;
    filterDto.alarmEndDate = filterDateDto.endDate;
    const alarmHistoryList = await this.alarmHistoryService.getFilteredEntities(filterDto);

    // 설비별 그룹화
    const equipmentAlarmMap = this.aggregateAlarmByEquipment(alarmHistoryList);
    // 설비 타입별 그룹화 및 상위 알람 선택
    const result = this.groupByEquipmentTypeAndGetTopAlarms(equipmentAlarmMap, limit);
  
    return result;
  }


  private aggregateAlarmByEquipment(alarmHistoryList: AlarmHistory[]): Map<string, {
    equipmentCode: string;
    equipmentName: string;
    equipmentTypeName: string;
    alarmCodes: Map<string, { code: string; description: string; count: number }>;
  }> {
    // 설비별로 그룹화
    const equipmentAlarmMap = new Map<string, {
      equipmentCode: string;
      equipmentName: string;
      equipmentTypeName: string;
      alarmCodes: Map<string, { code: string; description: string; count: number }>;
    }>();

    // 데이터 집계
    for (const history of alarmHistoryList) {
      const equipmentName = history.equipment_alarm_history?.equipment_name;
      const equipmentCode = history.equipment_alarm_history?.equipment_code;
      const equipmentTypeName = history.equipment_alarm_history?.alarm.equipment_type.name;
      const alarmCode = history.equipment_alarm_history?.alarm.code;
      const alarmDescription = history.equipment_alarm_history?.alarm.description;

      if (!equipmentCode || !alarmCode) {
        continue;
      }
    
      if (!equipmentAlarmMap.has(equipmentCode)) {
        equipmentAlarmMap.set(equipmentCode, {
          equipmentCode,
          equipmentName: equipmentName || '',
          equipmentTypeName: equipmentTypeName || '',
          alarmCodes: new Map()
        });
      }
      
      const equipmentData = equipmentAlarmMap.get(equipmentCode)!;
      const currentCount = equipmentData.alarmCodes.get(alarmCode)?.count || 0;
    
      equipmentData.alarmCodes.set(alarmCode, {
        code: alarmCode,
        description: alarmDescription || '',
        count: currentCount + 1
      });
    }
    return equipmentAlarmMap;
  }


  private groupByEquipmentTypeAndGetTopAlarms(equipmentAlarmMap: Map<string, {
    equipmentCode: string;
    equipmentName: string;
    equipmentTypeName: string;
    alarmCodes: Map<string, { code: string; description: string; count: number }>;
  }>, limit: number) {
    // equipmentType별 그룹화
    const equipmentTypeMap = new Map<string, EquipmentUnitDto[]>();

    for (const [equipmentCode, equipmentData] of equipmentAlarmMap) {
      const topAlarmCodes = Array.from(equipmentData.alarmCodes.values())
        .sort((a, b) => b.count - a.count)  // 발생 횟수 내림차순
        .slice(0, limit)  // 상위 N개만 선택
        .map((alarm, index) => ({
          rank: index + 1,
          alarmCode: alarm.code,
          alarmDesc: alarm.description,
          count: alarm.count
        }));
  
      const unitData: EquipmentUnitDto = {
        equipmentUnit: equipmentData.equipmentName,
        alarms: topAlarmCodes
      };
  
      if (!equipmentTypeMap.has(equipmentData.equipmentTypeName)) {
        equipmentTypeMap.set(equipmentData.equipmentTypeName, []);
      }
      
      equipmentTypeMap.get(equipmentData.equipmentTypeName)!.push(unitData);
    }
  
    // 최종 결과 생성
    const result: TopAlarmResponseByEquipmentDto[] = [];
    for (const [equipmentType, units] of equipmentTypeMap) {
      result.push({
        equipmentType,
        units
      });
    }
  
    return result;
  }

};