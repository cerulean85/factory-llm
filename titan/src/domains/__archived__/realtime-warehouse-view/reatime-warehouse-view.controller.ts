import { Body, Controller, Post, Put, Param, UseGuards } from '@nestjs/common';
import { JwtServiceAuthGuard } from '../../../core/auth/jwt/jwt-service.guard';
import { ApiBody } from '@nestjs/swagger';
import { ApiReturn } from 'src/common/decorator/api-return.decorator';
import { ResponseStatusDto } from 'src/common/dto/response-status.dto';
import { RealtimeWarehouseViewService } from './realtime-warehouse-view.service';
import { RealtimeWarehouseViewResponseDto } from './dto/response/realtime-warehouse-view-response.dto';
import { FilteringRealtimeWarehouseViewDto } from './dto/request/filtering-realtime-warehouse-view.dto';
import { UpdateRealtimeWarehouseViewDto } from './dto/request/update-realtime-warehouse-view.dto';

@Controller('realtime-warehouse-view')
export class RealtimeWarehouseViewController {
  constructor(
    private readonly service: RealtimeWarehouseViewService,
  ) {}

  @Post('get-realtime-warehouse-view')
  @ApiBody({ type : FilteringRealtimeWarehouseViewDto })
  @ApiReturn(RealtimeWarehouseViewResponseDto, '설비 가동 뷰 조회', '설비 가동 뷰 조회', '설비 가동 뷰 조회')
  @UseGuards(JwtServiceAuthGuard)
  async getRealtimeWarehouseView(
    @Body() filterDto: FilteringRealtimeWarehouseViewDto,
  ) {
    const result = await this.service.getRealtimeWarehouseViewList(filterDto);
    return result;
  }

  @Put('update/:id')
  @ApiBody({ type: UpdateRealtimeWarehouseViewDto })
  @ApiReturn(ResponseStatusDto, '설비 가동 뷰 수정', '설비 가동 뷰 수정', '설비 가동 뷰 수정 결과')
  @UseGuards(JwtServiceAuthGuard)
  async updateRealtimeWarehouseView(
    @Param('id') id: number,
    @Body() updateRealtimeWarehouseViewDto: UpdateRealtimeWarehouseViewDto,
  ) {
    const result = await this.service.updateRealtimeWarehouseView(id, updateRealtimeWarehouseViewDto);
    return result;
  }
}