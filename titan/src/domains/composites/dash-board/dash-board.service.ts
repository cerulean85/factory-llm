import { Logger, Injectable } from '@nestjs/common';
import { FilteringDateDto } from 'src/common/dto/filtering-date.dto';
import { DashBoardResponseDto } from './dto/response/dash-board-response.dto';
import { GettingAlarmHistoryStatisticsDto } from 'src/domains/alarm/history/alarm-history/dto/request/getting-alarm-history-statistics.dto';
import { AlarmHistoryService } from 'src/domains/alarm/history/alarm-history/alarm-history.service';
import { EquipmentAlarmHistoryService } from 'src/domains/alarm/history/alarm-history/sub-domain/equipment-alarm-history/equipment-alarm-history.service';
import { CraneCellViewService } from 'src/collector-interface/view/cell-view/crane-cell-view.service';
import { GantryCellViewService } from 'src/collector-interface/view/cell-view/gantry-cell-view.service';
import { GantryJobHistoryService } from 'src/domains/storage/job-history/gantry-job-history.service';
import { FilteringJobHistoryDto } from 'src/domains/storage/job-history/dto/request/filtering-job-history.dto';
import { EQUIPMENT_TYPE, TASK_TYPE, WAREHOUSE_TYPE } from 'src/common/enum/equipment.enum';
import { InitEndOfDay, InitStartOfDay } from 'src/utils/date-transform.util';
import { CraneJobHistoryService } from 'src/domains/storage/job-history/crane-job-history.service';
// import { GettingAlarmHistoryStatusDto } from 'src/domains/alarm/alarm-history/aggregated-alarm-history/dto/request/getting-alarm-history-status.dto';

@Injectable()
export class DashBoardService {
    private readonly logger = new Logger(DashBoardService.name)

    constructor(
    private readonly gantryJobHistoryService : GantryJobHistoryService,
    private readonly equipmentAlarmHistoryService: EquipmentAlarmHistoryService,
    private readonly craneJobHistoryService: CraneJobHistoryService,
    private readonly craneCellViewService: CraneCellViewService,
    private readonly gantryCellViewService: GantryCellViewService,
  ) {}

  async getDashBoard(filteringDateDto: FilteringDateDto): Promise<DashBoardResponseDto> {
    const result = new DashBoardResponseDto();

    result.palletCurrentCounts = await this.getPalletCurrentCounts();
    result.alarmHistoryEquipmentStatus = await this.getEquipmentAlarmStatus(filteringDateDto);
    result.dailyCraneCounts = await this.getDailyCraneCounts(filteringDateDto);
    result.dailyGantryCounts = await this.getDailyGantryCounts(filteringDateDto);
    result.craneStackedCounts = await this.getCraneStackedCounts();
    result.gantryStackedCounts = await this.getGantryStackedCounts();

    return result;
  }

  // 자동 창고 적치 현황
  async getPalletCurrentCounts() {
    const result = await this.craneCellViewService.getCurrentStackedCounts();
    return {
      currentCount: result.currentCount,
      totalCount: result.totalCount,
      rate: result.rate,
      emptyCellCount: result.emptyCellCount,
    };
  }

  // 알람 미처리 현황
  async getEquipmentAlarmStatus(filteringDateDto: FilteringDateDto) {
    const result = await this.equipmentAlarmHistoryService.getAlarmProcessStatisticsByEquipment(filteringDateDto as GettingAlarmHistoryStatisticsDto);
    return result;
  }

  // 자동 창고 적치량 추이
  async getDailyCraneCounts(filteringDateDto: FilteringDateDto) {
    const filterDto = new FilteringJobHistoryDto();
    filterDto.jobStartDate = InitStartOfDay(filteringDateDto.startDate);
    filterDto.jobEndDate = InitEndOfDay(filteringDateDto.endDate);
    filterDto.warehouseType = WAREHOUSE_TYPE.CRANE;
    filterDto.taskType = TASK_TYPE.INPUT;
    const result = await this.craneJobHistoryService.getDailyCraneCounts(filterDto);
    return result.map(item => ({
      date: item.date,
      currentCount: item.currentCount,
      cumulativeCount: item.cumulativeCount,
    }));
  }

  // 출고량 추이
  async getDailyGantryCounts(filteringDateDto: FilteringDateDto) {
    const filterDto = new FilteringJobHistoryDto();
    filterDto.jobStartDate =  InitStartOfDay(filteringDateDto.startDate);
    filterDto.jobEndDate = InitEndOfDay(filteringDateDto.endDate);
    filterDto.warehouseType = WAREHOUSE_TYPE.GANTRY;
    filterDto.taskType = TASK_TYPE.OUTPUT
    const result = await this.gantryJobHistoryService.getDailyGantryStackedCounts(filterDto);
    return result.map(item => ({
      date: item.date,
      currentCount: item.currentCount,
      cumulativeCount: item.cumulativeCount,
    }));

  }

  // S/C 미적치 쉘프 현황
  async getCraneStackedCounts() {
    const currentResult = await this.craneCellViewService.getCurrentCraneCountsByWarehouse();
    const result = currentResult.map(item => {
      return {
        warehouseId: item.warehouseId,
        stackAreaName: item.stackAreaCode,
        currentCount: item.currentCount,
        emptyCellCount: item.emptyCellCount,
      };
    });
    return result;
  }

  // Gantry 미적치 Stack 현황
  async getGantryStackedCounts() {
    const currentResult = await this.gantryCellViewService.getCurrentGantryCountsByWarehouse();
    const result = currentResult.map(item => ({
      warehouseId: item.warehouseId,
      stackAreaName: item.stackAreaCode,
      currentCount: item.currentCount,
      emptyCellCount: item.emptyCellCount,
    }));
    return result;
  }
};