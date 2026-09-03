import { Controller, Post, Body, Param, ParseIntPipe, Delete, UseGuards, Put } from '@nestjs/common';
import { CreateShippingSpecificationDto } from './dto/request/create-shipping-specification.dto';
import { UpdateShippingSpecificationDto } from './dto/request/update-shipping-specification.dto';
import { ShippingSpecificationResponseDto } from './dto/response/shipping-specification-response.dto';
import { ShippingSpecificationService } from './shipping-specification.service';

import { JwtServiceAuthGuard } from '../../../core/auth/jwt/jwt-service.guard';
import { ResponseStatusDto } from 'src/common/dto/response-status.dto';

import { ApiBody, ApiParam } from '@nestjs/swagger';
import { ApiPaginatedReturn } from 'src/common/decorator/api-paginated-return.decorator';
import { ApiReturn } from 'src/common/decorator/api-return.decorator';
import { FilteringDateDto } from 'src/common/dto/filtering-date.dto';
import { DailyShippingSpecificationDto } from './dto/response/daily-shipping-specification.dto';
import { MonthShipmentDto } from './dto/response/month-shipment.dto';
import { plainToInstance } from 'class-transformer';

@Controller('shipping-specification')
export class ShippingSpecificationController {
  constructor(
    private readonly shippingSpecificationService: ShippingSpecificationService,
  ) {}
  //모든 중점 출고 규격 조회
  @Post('get-shipping-specification-list')
  @UseGuards(JwtServiceAuthGuard)
  @ApiPaginatedReturn(ShippingSpecificationResponseDto, "모든 중점 출고 규격 데이터 조회", "모든 중점 출고 규격 데이터 조회", "모든 중점 출고 규격 데이터" )
  async getAllShippingSpecification(): Promise<ShippingSpecificationResponseDto[]> {
    const result = await this.shippingSpecificationService.getAllShippingSpecification();
    return result;
  };

  //중점 출고 규격 데이터 생성
  @Post('create-shipping-specification')
  @UseGuards(JwtServiceAuthGuard)
  @ApiBody({ type : CreateShippingSpecificationDto })
  @ApiReturn(ShippingSpecificationResponseDto, "중점 출고 규격 데이터 등록", "중점 출고 규격 데이터 등록", "중점 출고 규격 데이터" )
  async createShippingSpecification(
    @Body() createShippingSpecificationDto: CreateShippingSpecificationDto
  ): Promise<ShippingSpecificationResponseDto> {
    const rawData = await this.shippingSpecificationService.createShippingSpecification(createShippingSpecificationDto);
    const result = plainToInstance(ShippingSpecificationResponseDto, rawData, { excludeExtraneousValues: true });
    return result;
  };

  //일별 중점 출고 규격 데이터 조회
  @Post('get-daily-shipping-specification')
  @UseGuards(JwtServiceAuthGuard)
  @ApiReturn(DailyShippingSpecificationDto, "일별 중점 출고 규격 데이터", "일별 중점 출고 규격 데이터", "일별 중점 출고 규격 데이터" )
  async getDailyShippingSpecification(
    @Body() filteringDateDto: FilteringDateDto,
  ) {
    const result = await this.shippingSpecificationService.getDailyShippingSpecification(filteringDateDto);
    return result;
  }

  //특정 중점 출고 규격 데이터 조회
  @Post('get-shipping-specification/:shippingSpecificationId')
  @UseGuards(JwtServiceAuthGuard)
  @ApiParam({ name: 'shippingSpecificationId', type: Number, description: '중점 출고 규격 데이터 ID' })
  @ApiReturn(ShippingSpecificationResponseDto, "특정 중점 출고 규격 데이터 조회", "특정 중점 출고 규격 데이터 조회", "특정 중점 출고 규격 데이터" )
  async getShippingSpecification(
    @Param('shippingSpecificationId') shippingSpecificationId: number
  ): Promise<ShippingSpecificationResponseDto> {
    const result = await this.shippingSpecificationService.findShippingSpecificationById(shippingSpecificationId);
    return result;
  };

  // 중점 출고 규격 월별 출하량
  @Post('/get-current-month-shipment')
  @ApiReturn(MonthShipmentDto, "이번달 중점 출고 규격 출하량", "이번달 중점 출고 규격 출하량", "이번달 중점 출고 규격 출하량" )
  @UseGuards(JwtServiceAuthGuard)
  async getCurrentMonthShipment(): Promise<MonthShipmentDto[]> {
    const result = await this.shippingSpecificationService.getCurrentMonthShipment();
    return result;
  };

  //중점 출고 규격 데이터 업데이트
  @Put('update-shipping-specification/:shippingSpecificationId')
  @UseGuards(JwtServiceAuthGuard)
  @ApiParam({ name: 'shippingSpecificationId', type: Number, description: '중점 출고 규격 데이터 ID' })
  @ApiBody({ type : UpdateShippingSpecificationDto })
  @ApiReturn(ResponseStatusDto, "중점 출고 규격 데이터 수정", "중점 출고 규격 데이터 수정", "중점 출고 규격 데이터 수정" )
  async updateShippingSpecification(
    @Param('shippingSpecificationId' ) shippingSpecificationId: number,
    @Body() updateShippingSpecificationDto: UpdateShippingSpecificationDto,
  ): Promise<ResponseStatusDto> {
    const result = this.shippingSpecificationService.updateShippingSpecification(shippingSpecificationId, updateShippingSpecificationDto);
    return result;
  };

  //중점 출고 규격 데이터 삭제
  @Delete('soft-delete-shipping-specification/:shippingSpecificationId')
  @UseGuards(JwtServiceAuthGuard)
  @ApiParam({ name: 'shippingSpecificationId', type: Number, description: '중점 출고 규격 데이터 ID' })
  @ApiReturn(ResponseStatusDto, "중점 출고 규격 데이터 삭제", "중점 출고 규격 데이터 삭제", "중점 출고 규격 데이터삭제" )
  async softDeleteShippingSpecification(
    @Param('shippingSpecificationId') shippingSpecificationId: number,
  ): Promise<ResponseStatusDto> {
    const result = this.shippingSpecificationService.softDeleteShippingSpecificationById(shippingSpecificationId);
    return result
  };
}