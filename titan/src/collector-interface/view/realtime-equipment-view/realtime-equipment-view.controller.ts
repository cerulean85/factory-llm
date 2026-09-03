import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtServiceAuthGuard } from 'src/core/auth/jwt/jwt-service.guard';
import { RealtimeEquipmentViewService } from './realtime-equipment-view.service';
import { FilteringRealtimeEquipmentViewDto } from './dto/request/filtering-realtime-equipment-view.dto';
import { ApiReturn } from 'src/common/decorator/api-return.decorator';
import { RealtimeEquipmentViewResponseDto } from './dto/response/realtime-equipment-view-response.dto';

@Controller('realtime-view')
export class RealtimeEquipmentViewController {
  constructor(
    private readonly realtimeViewService: RealtimeEquipmentViewService,
  ) {}
  @Post('get-all-realtime-view')
  // @UseGuards(JwtServiceAuthGuard)
  @ApiReturn(
    RealtimeEquipmentViewResponseDto,
    '실시간 설비 상태 목록',
    '실시간 설비 상태 목록',
    '실시간 설비 상태 목록',
  )
  async getAllRealtimeView(
    @Body() filterDto: FilteringRealtimeEquipmentViewDto,
  ) {
    const result =
      await this.realtimeViewService.getRealtimeViewList(filterDto);
    return result;
  }
}
