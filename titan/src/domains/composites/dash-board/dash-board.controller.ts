import { Controller, Post, UseGuards, Body } from '@nestjs/common';

import { ApiReturn } from 'src/common/decorator/api-return.decorator';
import { JwtServiceAuthGuard } from 'src/core/auth/jwt/jwt-service.guard';
import { FilteringDateDto } from 'src/common/dto/filtering-date.dto';
import { DashBoardResponseDto } from './dto/response/dash-board-response.dto';
import { DashBoardService } from './dash-board.service';

@Controller('dash-board')
export class DashBoardController {
  constructor(private readonly dashBoardService: DashBoardService) {}
  // #region Post
  @Post('/get-dash-board')
  @ApiReturn(DashBoardResponseDto, '대시보드', '대시보드', '대시보드')
  // @UseGuards(JwtServiceAuthGuard)
  async getDashBoard(@Body() filteringDateDto: FilteringDateDto) {
    const result = await this.dashBoardService.getDashBoard(filteringDateDto);
    return result;
  }
  // #endregion
}
