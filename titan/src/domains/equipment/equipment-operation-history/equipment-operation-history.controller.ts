import { Body, Controller, Post, Put, Param, UseGuards } from '@nestjs/common';
import { EquipmentOperationHistoryService } from './equipment-operation-history.service';
import { JwtServiceAuthGuard } from '../../../core/auth/jwt/jwt-service.guard';
import { ApiBody } from '@nestjs/swagger';
import { ApiReturn } from 'src/common/decorator/api-return.decorator';
import { PaginationRequestDto } from 'src/common/dto/pagination-request.dto';
import { Pagination } from 'src/utils/pagination.util';
import { EquipmentOperationResponseDto } from './dto/response/equipment-operation-history-response.dto';
import { EquipmentOperationHistoryAggregationDto } from './dto/response/equipment-operation-history-aggregation.dto';
import { GettingEquipmentOperationStatusDto } from './dto/request/getting-equipment-operation-status.dto';
import { UpdateEquipmentOperationHistoryDto } from './dto/request/update-equipment-operation-history.dto';
import { ResponseStatusDto } from 'src/common/dto/response-status.dto';

@Controller('equipment-operation-history')
export class EquipmentOperationHistoryController {
  constructor(
    private readonly equipmentOperationHistoryService: EquipmentOperationHistoryService,
  ) {}

  @Post('get-pagination')
  @ApiReturn(EquipmentOperationResponseDto, '설비 가동 내역 전체 조회', '설비 가동 내역 전체 조회', '설비 가동 내역 전체 조회')
  @UseGuards(JwtServiceAuthGuard)
  async getPagination(
    @Body() paginationRequest: PaginationRequestDto
  ) {
    const createdData = await this.equipmentOperationHistoryService.getPagination(paginationRequest);
    const result = Pagination.transformPaginatedData(EquipmentOperationResponseDto, paginationRequest, createdData);
    return result;
  }

  
  @Post('get-aggregation')
  @ApiBody({ type : GettingEquipmentOperationStatusDto })
  @ApiReturn(EquipmentOperationHistoryAggregationDto, '설비 가동 내역 집계', '설비 가동 내역 집계', '설비 가동 내역 집계 결과')
  @UseGuards(JwtServiceAuthGuard)
  async getEquipmentOperationHistory(
    @Body() reqDto: GettingEquipmentOperationStatusDto,
  ): Promise<EquipmentOperationHistoryAggregationDto[]> {
    const result = await this.equipmentOperationHistoryService.getEquipmentOperationStats(reqDto.startDate, reqDto.endDate);
    return result;
  }

  @Put('update/:id')
  @ApiBody({ type: UpdateEquipmentOperationHistoryDto })
  @ApiReturn(ResponseStatusDto, '설비 가동 내역 수정', '설비 가동 내역 수정', '설비 가동 내역 수정 결과')
  @UseGuards(JwtServiceAuthGuard)
  async updateEquipmentOperationHistory(
    @Param('id') id: number,
    @Body() updateEquipmentOperationHistoryDto: UpdateEquipmentOperationHistoryDto,
  ) {
    const result = await this.equipmentOperationHistoryService.updateEquipmentOperationHistory(id, updateEquipmentOperationHistoryDto);
    return result;
  }
}