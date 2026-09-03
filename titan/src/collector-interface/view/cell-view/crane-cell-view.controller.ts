import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtServiceAuthGuard } from 'src/core/auth/jwt/jwt-service.guard';
import { ApiReturn } from 'src/common/decorator/api-return.decorator';
import { CraneCellCurrentStackedCountsDto } from './dto/response/crane-cell-current-stacked-counts.dto';
import { CraneCellViewService } from './crane-cell-view.service';
import { CellStackedCountsDto } from './dto/response/cell-stacked-counts.dto';
import { PalletGroupsResponseDto } from './dto/response/pallet-groups-response.dto';
import { LongProductResponseDto } from './dto/response/long-product-response.dto';

@Controller('crane-item-history')
export class CraneCellViewController {
  constructor(private readonly craneCellViewService: CraneCellViewService) {}
  @Post('get-pallet-current-stacked-counts')
  // @UseGuards(JwtServiceAuthGuard)
  @ApiReturn(
    CraneCellCurrentStackedCountsDto,
    '팔레트 적치 현황 개수 집계',
    '팔레트 적치 현황 개수 집계',
    '팔레트 적치 현황 개수 집계',
  )
  async getPalletCurrentStackedCounts() {
    const result = await this.craneCellViewService.getCurrentStackedCounts();
    return result;
  }

  @Post('get-current-crane-counts')
  // @UseGuards(JwtServiceAuthGuard)
  @ApiReturn(
    CellStackedCountsDto,
    'Crane 현황 집계',
    'Crane 현황 집계',
    'Crane 현황 집계',
  )
  async getCurrentCraneCounts() {
    const result =
      await this.craneCellViewService.getCurrentCraneCountsByWarehouse();
    return result;
  }

  @Post('get-pallet-level-groups')
  // @UseGuards(JwtServiceAuthGuard)
  @ApiReturn(
    PalletGroupsResponseDto,
    '팔레트 레벨 구간 별 적재 개수',
    '팔레트 레벨 구간 별 적재 개수',
    '팔레트 레벨 구간 별 적재 개수',
  )
  async getPalletLevelGroups(): Promise<PalletGroupsResponseDto[]> {
    const result = await this.craneCellViewService.getPalletLevelGroups();
    return result;
  }

  @Post('get-long-product-groups')
  // @UseGuards(JwtServiceAuthGuard)
  @ApiReturn(
    LongProductResponseDto,
    '장기 재고 기간 별 개수',
    '장기 재고 기간 별 개수',
    '장기 재고 기간 별 개수',
  )
  async getLongProductGroups() {
    const result = await this.craneCellViewService.getLongProductGroups();
    return result;
  }
}
