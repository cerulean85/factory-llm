import { Body, Controller, Post, Put, Param, UseGuards } from '@nestjs/common';
import { EquipmentOperationMaintenanceService } from './equipment-operation-maintenance.service';
import { JwtServiceAuthGuard } from '../../../core/auth/jwt/jwt-service.guard';
import { ApiBody } from '@nestjs/swagger';
import { ApiReturn } from 'src/common/decorator/api-return.decorator';
import { EquipmentOperationMaintenanceAggregationDto } from './dto/response/equipment-operation-maintenance-aggregation.dto';
import { ResponseStatusDto } from 'src/common/dto/response-status.dto';
import { EquipmentOperationResponseDto } from '../../equipment/equipment-operation-history/dto/response/equipment-operation-history-response.dto';
import { FilteringEquipmentOperationMaintenanceDto } from './dto/request/filtering-equipment-operation-maintenance.dto';
import { FilteringDateDto } from 'src/common/dto/filtering-date.dto';
import { UpdateEquipmentOperationMaintenanceDto } from './dto/request/update-equipment-operation-maintenance.dto';
import { CreateEquipmentOperationMaintenanceDto } from './dto/request/create-equipment-operation-maintenance.dto';
import { EquipmentOperationMaintenanceResponseDto } from './dto/response/equipment-operation-maintenance-response.dto';
import { plainToInstance } from 'class-transformer';

@Controller('equipment-operation-maintenance')
export class EquipmentOperationMaintenanceController {
  constructor(
    private readonly eomService: EquipmentOperationMaintenanceService,
  ) {}

  @Post('create')
  @UseGuards(JwtServiceAuthGuard)
  @ApiBody({ type : CreateEquipmentOperationMaintenanceDto })
  @ApiReturn(EquipmentOperationMaintenanceResponseDto, "설비 가동 보수 이력 생성", "설비 가동 보수 이력 생성", "설비 가동 보수 이력" )
  async createTodo(
    @Body() createDto: CreateEquipmentOperationMaintenanceDto
  ): Promise<EquipmentOperationMaintenanceResponseDto>{
    const createdData = await this.eomService.createOperationMaintenance(createDto);
    const result = plainToInstance(EquipmentOperationMaintenanceResponseDto, createdData, { excludeExtraneousValues: true });
    return result;
  };

  @Post('get-pagination')
  @ApiReturn(EquipmentOperationResponseDto, '설비 가동 보수 이력 조회', '설비 가동 보수 이력 조회', '설비 가동 보수 이력 조회')
  @UseGuards(JwtServiceAuthGuard)
  async getAllEquipmentOperationMaintenance(
    @Body() reqDto: FilteringEquipmentOperationMaintenanceDto
  ) {
    const result = await this.eomService.getPaginatedData(reqDto);
    return result;
  }

  
  @Post('get-aggregation')
  @ApiBody({ type : FilteringDateDto })
  @ApiReturn(EquipmentOperationMaintenanceAggregationDto, '설비 가동 보수 이력 집계', '설비 보수 이력 집계', '설비 보수 이력 집계 결과')
  @UseGuards(JwtServiceAuthGuard)
  async getEquipmentOperationMaintenance(
    @Body() reqDto: FilteringDateDto,
  ): Promise<EquipmentOperationMaintenanceAggregationDto[]> {
    const result = await this.eomService.getAggregation(reqDto.startDate, reqDto.endDate);
    return result;
  }


  @Put('update/:id')
  @ApiBody({ type: UpdateEquipmentOperationMaintenanceDto })
  @ApiReturn(ResponseStatusDto, '설비 가동 보수 이력 수정', '설비 가동 보수 이력 수정', '설비 가동 보수 이력 수정 결과')
  @UseGuards(JwtServiceAuthGuard)
  async updateEquipmentOperationMaintenance(
    @Param('id') id: number,
    @Body() reqDto: UpdateEquipmentOperationMaintenanceDto,
  ) {
    const result = await this.eomService.updateEquipmentOperationMaintenance(id, reqDto);
    return result;
  }
}