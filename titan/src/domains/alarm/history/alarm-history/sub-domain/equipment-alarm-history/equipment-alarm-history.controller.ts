import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';

import { ApiBody } from '@nestjs/swagger';

import { ApiReturn } from 'src/common/decorator/api-return.decorator';
import { JwtServiceAuthGuard } from 'src/core/auth/jwt/jwt-service.guard';
import { GettingAlarmHistoryStatisticsDto } from '../../dto/request/getting-alarm-history-statistics.dto';
import { AlarmProcessEquipmentStatisticsDto } from './dto/response/alarm-process-equipment-statistics.dto';
import { TopAlarmResponseByEquipmentDto } from './dto/response/top-alarm-response-by-equipment.dto';
import { FilteringDateDto } from 'src/common/dto/filtering-date.dto';
import { EquipmentAlarmHistoryService } from './equipment-alarm-history.service';
import { InitEndOfDay, InitStartOfDay } from 'src/utils/date-transform.util';
import { AlarmProcessDailyStatisticsDto } from './dto/response/alarm-process-daily-statistics.dto';

@Controller('alarm-history')
export class EquipmentAlarmHistoryController {
  constructor(
    private readonly equipmentAlarmHistoryService: EquipmentAlarmHistoryService,
  ) {}

  @Post('get-process-status-by-equipment')
  // @UseGuards(JwtServiceAuthGuard)
  @ApiBody({ type: GettingAlarmHistoryStatisticsDto })
  @ApiReturn(
    AlarmProcessEquipmentStatisticsDto,
    '설비별 알람 처리 내역',
    '설비별 알람 처리 내역',
    '설비별 알람 처리 내역',
  )
  async getAlarmProcessStatusByEquipment(
    @Body() reqDateStatusDto: GettingAlarmHistoryStatisticsDto,
  ) {
    reqDateStatusDto.startDate = InitStartOfDay(reqDateStatusDto.startDate);
    reqDateStatusDto.endDate = InitEndOfDay(reqDateStatusDto.endDate);
    const status =
      await this.equipmentAlarmHistoryService.getAlarmProcessStatisticsByEquipment(
        reqDateStatusDto,
      );
    return status;
  }

  @Post('get-process-status-by-date')
  @UseGuards(JwtServiceAuthGuard)
  @ApiBody({ type: GettingAlarmHistoryStatisticsDto })
  @ApiReturn(
    AlarmProcessDailyStatisticsDto,
    '날짜별 알람 처리 내역',
    '날짜별 알람 처리 내역',
    '날짜별 알람 처리 내역',
  )
  async getAlarmProcessStatusByDate(
    @Body() reqDateStatusDto: GettingAlarmHistoryStatisticsDto,
  ) {
    reqDateStatusDto.startDate = InitStartOfDay(reqDateStatusDto.startDate);
    reqDateStatusDto.endDate = InitEndOfDay(reqDateStatusDto.endDate);
    const status =
      await this.equipmentAlarmHistoryService.getEquipmentAlarmProcessStatisticsByDay(
        reqDateStatusDto,
      );
    return status;
  }

  @Post('/get-top-alarm-list-by-equipment')
  @UseGuards(JwtServiceAuthGuard)
  @ApiReturn(
    TopAlarmResponseByEquipmentDto,
    '설비별 상위 알람 리스트',
    '설비별 상위 알람 리스트',
    '설비별 상위 알람 리스트',
  )
  async getTopAlarmListByEquipment(@Body() filterDateDto: FilteringDateDto) {
    const result =
      await this.equipmentAlarmHistoryService.getTopAlarmListByEquipment(
        3,
        filterDateDto,
      );
    return result;
  }
}
