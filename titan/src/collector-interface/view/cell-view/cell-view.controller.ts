import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtServiceAuthGuard } from 'src/core/auth/jwt/jwt-service.guard';
import { CellViewService } from './cell-view.service';
import { FilteringCellViewDto } from './dto/request/filtering-cell-view.dto';
import { ApiReturn } from 'src/common/decorator/api-return.decorator';
import { CellViewResponseDto } from './dto/response/cell-view-response.dto';

@Controller('cell-view')
export class CellViewController {
  constructor(private readonly cellViewService: CellViewService) {}
  @Post('get-all-cell')
  // @UseGuards(JwtServiceAuthGuard)
  @ApiReturn(CellViewResponseDto, '셀 별 현황', '셀 별 현황', '셀 별 현황')
  async getAllCellView(@Body() filterDto: FilteringCellViewDto) {
    const result = await this.cellViewService.getCellList(filterDto);
    return result;
  }
}
