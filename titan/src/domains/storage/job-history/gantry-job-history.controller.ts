import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtServiceAuthGuard } from 'src/core/auth/jwt/jwt-service.guard';

import { ApiBody } from '@nestjs/swagger';
import { ApiReturn } from 'src/common/decorator/api-return.decorator';
import { FilteringDateDto } from 'src/common/dto/filtering-date.dto';
import { DailyStatusCountsDto } from './dto/response/daily-status-counts.dto';
import { GantryJobHistoryService } from './gantry-job-history.service';
import { FilteringJobHistoryDto } from './dto/request/filtering-job-history.dto';
import {
  EQUIPMENT_TYPE,
  TASK_TYPE,
  WAREHOUSE_TYPE,
} from 'src/common/enum/equipment.enum';
import { InitEndOfDay, InitStartOfDay } from 'src/utils/date-transform.util';

@Controller('gantry-item-history')
export class GantryJobHistoryController {
  constructor(
    private readonly gantryJobHistoryService: GantryJobHistoryService,
  ) {}

  @Post('get-daily-gantry-out-counts') // == get-gantry-out-counts == get-daily-out-counts
  @ApiBody({ type: FilteringDateDto })
  @ApiReturn(
    DailyStatusCountsDto,
    '일별 갠트리 출고 현황',
    '일별 갠트리 출고 현황',
    '갠트리 출고 현황',
  )
  // @UseGuards(JwtServiceAuthGuard)
  async getDailyGantryOutCounts(@Body() filteringDateDto: FilteringDateDto) {
    const filterDto = new FilteringJobHistoryDto();
    filterDto.jobStartDate = InitStartOfDay(filteringDateDto.startDate);
    filterDto.jobEndDate = InitEndOfDay(filteringDateDto.endDate);
    filterDto.warehouseType = WAREHOUSE_TYPE.GANTRY;
    filterDto.taskType = TASK_TYPE.OUTPUT;

    const rst =
      await this.gantryJobHistoryService.getDailyGantryStackedCounts(filterDto);
    return rst;
  }
}
