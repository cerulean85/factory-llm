import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtServiceAuthGuard } from 'src/core/auth/jwt/jwt-service.guard';

import { ApiBody } from '@nestjs/swagger';
import { ApiReturn } from 'src/common/decorator/api-return.decorator';
import { FilteringDateDto } from 'src/common/dto/filtering-date.dto';
import { DailyStatusCountsDto } from './dto/response/daily-status-counts.dto';
import { CraneJobHistoryService } from './crane-job-history.service';
import {
  EQUIPMENT_TYPE,
  TASK_TYPE,
  WAREHOUSE_TYPE,
} from 'src/common/enum/equipment.enum';
import { InitEndOfDay, InitStartOfDay } from 'src/utils/date-transform.util';
import { MonthlyStatusCountsDto } from './dto/response/monthly-status-counts.dto';
import { StandardTypesDailyCountsDto } from './dto/response/standard-types-daily-counts.dto';
import { FilteringJobHistoryDto } from './dto/request/filtering-job-history.dto';

@Controller('crane-item-history')
export class CraneJobHistoryController {
  constructor(
    private readonly craneJobHistoryService: CraneJobHistoryService,
  ) {}

  @Post('get-daily-crane-out-counts')
  @ApiBody({ type: FilteringDateDto })
  @ApiReturn(
    DailyStatusCountsDto,
    '일별 크레인 출고 현황',
    '일별 크레인 출고 현황',
    '크레인 출고 현황',
  )
  @UseGuards(JwtServiceAuthGuard)
  async getDailyCraneOutCounts(@Body() filteringDateDto: FilteringDateDto) {
    const filterDto = new FilteringJobHistoryDto();
    filterDto.jobStartDate = InitStartOfDay(filteringDateDto.startDate);
    filterDto.jobEndDate = InitEndOfDay(filteringDateDto.endDate);
    filterDto.warehouseType = WAREHOUSE_TYPE.CRANE;
    filterDto.taskType = TASK_TYPE.OUTPUT;

    const rst =
      await this.craneJobHistoryService.getDailyCraneCounts(filterDto);
    return rst;
  }

  @Post('get-daily-crane-stacked-counts')
  @ApiBody({ type: FilteringDateDto })
  @ApiReturn(
    DailyStatusCountsDto,
    '일별 크레인 적치 현황',
    '일별 크레인 적치 현황',
    '크레인 적치 현황',
  )
  // @UseGuards(JwtServiceAuthGuard)
  async getDailyCraneStackedCounts(@Body() filteringDateDto: FilteringDateDto) {
    const filterDto = new FilteringJobHistoryDto();
    filterDto.jobStartDate = InitStartOfDay(filteringDateDto.startDate);
    filterDto.jobEndDate = InitEndOfDay(filteringDateDto.endDate);
    filterDto.warehouseType = WAREHOUSE_TYPE.CRANE;
    filterDto.taskType = TASK_TYPE.INPUT;
    const rst =
      await this.craneJobHistoryService.getDailyCraneCounts(filterDto);
    return rst;
  }

  @Post('get-monthly-crane-counts')
  @ApiBody({ type: FilteringDateDto })
  @ApiReturn(
    MonthlyStatusCountsDto,
    '월별 크레인 출고 현황',
    '월별 크레인 출고 현황',
    '크레인 출고 현황',
  )
  @UseGuards(JwtServiceAuthGuard)
  async getMonthlyCraneCounts(@Body() filteringDateDto: FilteringDateDto) {
    filteringDateDto.startDate = InitStartOfDay(filteringDateDto.startDate);
    filteringDateDto.endDate = InitEndOfDay(filteringDateDto.endDate);
    const rst =
      await this.craneJobHistoryService.getMonthlyCraneCounts(filteringDateDto);
    return rst;
  }

  @Post('get-daily-top-standard-types-counts')
  @ApiReturn(
    StandardTypesDailyCountsDto,
    '상위 타입 및 일별 조회',
    '상위 타입 및 일별 조회',
    '상위 타입 및 일별 조회',
  )
  @UseGuards(JwtServiceAuthGuard)
  async getDailyTopStandardTypesCounts(
    @Body() filteringDateDto: FilteringDateDto,
  ) {
    filteringDateDto.startDate = InitStartOfDay(filteringDateDto.startDate);
    filteringDateDto.endDate = InitEndOfDay(filteringDateDto.endDate);
    const result =
      await this.craneJobHistoryService.getDailyTop5StandardTypesCounts(
        filteringDateDto,
      );
    return result;
  }
}
