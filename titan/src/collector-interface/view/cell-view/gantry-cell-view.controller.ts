import { Controller, Post, UseGuards } from '@nestjs/common';
import { JwtServiceAuthGuard } from 'src/core/auth/jwt/jwt-service.guard';
import { ApiReturn } from 'src/common/decorator/api-return.decorator';
import { CellStackedCountsDto } from './dto/response/cell-stacked-counts.dto';
import { GantryCellViewService } from './gantry-cell-view.service';

@Controller('gantry-item-history')
export class GantryCellViewController {
  constructor(private readonly gantryCellViewService: GantryCellViewService) {}
  @Post('get-current-gantry-counts')
  // @UseGuards(JwtServiceAuthGuard)
  @ApiReturn(
    CellStackedCountsDto,
    'Gantry 현황 집계',
    'Gantry 현황 집계',
    'Gantry 현황 집계',
  )
  async getCurrentGantryCounts() {
    const result =
      await this.gantryCellViewService.getCurrentGantryCountsByWarehouse();
    return result;
  }
}
