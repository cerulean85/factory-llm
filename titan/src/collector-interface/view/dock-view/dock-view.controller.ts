import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtServiceAuthGuard } from 'src/core/auth/jwt/jwt-service.guard';
import { DockViewService } from './dock-view.service';
import { FilteringDockViewDto } from './dto/request/filtering-dock-view.dto';
import { ApiReturn } from 'src/common/decorator/api-return.decorator';
import { DockViewResponseDto } from './dto/response/dock-view-response.dto';

@Controller('dock-view')
export class DockViewController {
  constructor(
    private readonly dockViewService: DockViewService,
  ) {}
  @Post('get-all-dock')
  @UseGuards(JwtServiceAuthGuard)
  @ApiReturn(DockViewResponseDto, '도크 별 출하 현황', '도크 별 출하 현황', '도크 별 출하 현황')
  async getAllDockView(
    @Body() filterDto: FilteringDockViewDto
  ) {
    const result = await this.dockViewService.getDockList(filterDto);
    return result;
  }
}