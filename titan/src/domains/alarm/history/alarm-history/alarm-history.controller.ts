import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';

import { AlarmHistoryService } from './alarm-history.service';

import { ApiBody, ApiParam } from '@nestjs/swagger';

import { ApiReturn } from 'src/common/decorator/api-return.decorator';
import { JwtServiceAuthGuard } from 'src/core/auth/jwt/jwt-service.guard';
import { ApiPaginatedReturn } from 'src/common/decorator/api-paginated-return.decorator';
import { AggregatedAlarmHistoryResponseDto } from './dto/response/aggregated-alarm-history-response.dto';
import { AlarmProcessDailyStatisticsDto } from './sub-domain/equipment-alarm-history/dto/response/alarm-process-daily-statistics.dto';
import { UpdateProcessAlarmHistoryDto } from './dto/request/update-process-alarm-history.dto';
import { ResponseStatusDto } from 'src/common/dto/response-status.dto';
import { GettingAlarmHistoryStatisticsDto } from './dto/request/getting-alarm-history-statistics.dto';
import { FilteringAlarmHistoryDto } from './dto/request/filtering-alarm-history.dto';
import { InitEndOfDay, InitStartOfDay } from 'src/utils/date-transform.util';

@Controller('alarm-history')
export class AlarmHistoryController {
  constructor(private readonly alarmHistoryService: AlarmHistoryService) {}

  @Post('/get-alarm-history')
  @UseGuards(JwtServiceAuthGuard)
  @ApiBody({ type: FilteringAlarmHistoryDto })
  @ApiReturn(
    AggregatedAlarmHistoryResponseDto,
    '알람 내역 조회',
    '등록된 알람 내역 조회',
    '알람 내역',
  )
  async getAlarmHistory(@Body() filteringDto: FilteringAlarmHistoryDto) {
    if (filteringDto.alarmStartDate) {
      InitStartOfDay(filteringDto.alarmStartDate);
      filteringDto.alarmStartDate = InitStartOfDay(filteringDto.alarmStartDate);
    }
    if (filteringDto.alarmEndDate) {
      filteringDto.alarmEndDate = InitEndOfDay(filteringDto.alarmEndDate);
    }
    if (filteringDto.processStartDate) {
      filteringDto.processStartDate = InitStartOfDay(
        filteringDto.processStartDate,
      );
    }
    if (filteringDto.processEndDate) {
      filteringDto.processEndDate = InitEndOfDay(filteringDto.processEndDate);
    }
    const result = await this.alarmHistoryService.getFilteredList(filteringDto);
    return result;
  }

  @Post('/get-paginated-alarm-history')
  // @UseGuards(JwtServiceAuthGuard)
  @ApiBody({ type: FilteringAlarmHistoryDto })
  @ApiPaginatedReturn(
    AggregatedAlarmHistoryResponseDto,
    '알람 내역 조회',
    '등록된 알람 내역 조회',
    '알람 내역',
  )
  async getPaginatedAlarmHistory(
    @Body() filteringDto: FilteringAlarmHistoryDto,
  ) {
    if (filteringDto.alarmStartDate) {
      filteringDto.alarmStartDate = InitStartOfDay(filteringDto.alarmStartDate);
    }
    if (filteringDto.alarmEndDate) {
      filteringDto.alarmEndDate = InitEndOfDay(filteringDto.alarmEndDate);
    }
    if (filteringDto.processStartDate) {
      filteringDto.processStartDate = InitStartOfDay(
        filteringDto.processStartDate,
      );
    }
    if (filteringDto.processEndDate) {
      filteringDto.processEndDate = InitEndOfDay(filteringDto.processEndDate);
    }
    const result =
      await this.alarmHistoryService.getFilterdPaginatedList(filteringDto);
    return result;
  }

  @Post('/update/:alarmHistoryId')
  @UseGuards(JwtServiceAuthGuard)
  @ApiBody({ type: UpdateProcessAlarmHistoryDto })
  @ApiReturn(
    ResponseStatusDto,
    '알람 내역 갱신',
    '알람 내역 갱신',
    '알람 내역 갱신 성공여부 반환',
  )
  async updateAlarmHistoryProcessMessage(
    @Param('alarmHistoryId', ParseIntPipe) alarmHistoryId: number,
    @Body() updateProcessAlarmHistory: UpdateProcessAlarmHistoryDto,
  ) {
    const result = await this.alarmHistoryService.updateProcessAlarmHistory(
      alarmHistoryId,
      updateProcessAlarmHistory,
    );
    return result;
  }
}
