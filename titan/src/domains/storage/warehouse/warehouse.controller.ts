import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { WarehouseService } from './warehouse.service';
import { JwtServiceAuthGuard } from '../../../core/auth/jwt/jwt-service.guard';
import { WarehouseResponseDto } from './dto/response/warehouse-response.dto';

import { ApiParam, ApiBody} from '@nestjs/swagger';
import { ApiReturn } from 'src/common/decorator/api-return.decorator';
import { ResponseStatusDto } from 'src/common/dto/response-status.dto';
import { plainToInstance } from 'class-transformer';

@Controller('warehouse')
export class WarehouseController {
  constructor(
    private readonly warehouseService: WarehouseService,
  ) {}

  //#region GET
  //모든 창고 조회
  @Get('get-all-warehouse')
  @UseGuards(JwtServiceAuthGuard)
  @ApiReturn(WarehouseResponseDto, "모든 창고 조회", "등록된 모든 창고 조회", "모든 창고" )
  async getAllWarehouse() {
    const data = await this.warehouseService.getAllWarehouse();
    const result = plainToInstance(WarehouseResponseDto, data, { excludeExtraneousValues: true });
    return result;
  }

  @Get('get-warehouse/:id')
  @UseGuards(JwtServiceAuthGuard)
  @ApiParam({ name: 'id', type: Number, description: '창고 ID' })
  @ApiReturn(WarehouseResponseDto, "창고 상세 조회", "등록된 창고 상세 조회", "창고 상세" )
  async getWarehouseById(
    @Param('id') id: number
  ) {
    const data = await this.warehouseService.getWarehouseById(id);
    const result = plainToInstance(WarehouseResponseDto, data, { excludeExtraneousValues: true });
    return result;
  }
  //#endregion

  //#region DELETE
  //창고 삭제
  @Delete('soft-delete-warehouse/:id')
  @UseGuards(JwtServiceAuthGuard)
  @ApiParam({ name: 'id', type: Number, description: '창고 ID' })
  @ApiReturn(ResponseStatusDto, "창고 데이터 삭제", "창고 데이터 삭제", "창고 데이터 삭제 결과" )
  async softDeleteWarehouse(
    @Param('id') id: number
  ) {
    const isSuccess = await this.warehouseService.softDeleteWarehouse(id);

    const responseStatusDto = new ResponseStatusDto();
    responseStatusDto.isSuccess = isSuccess;
    responseStatusDto.message = isSuccess ? 'Warehouse deleted successfully.' : 'Failed to delete warehouse.';
    return responseStatusDto;
  }
  //#endregion
}