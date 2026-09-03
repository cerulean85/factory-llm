import { Expose, Transform } from 'class-transformer';
import { IsString, Length, IsOptional, IsInt, IsDate, ValidateIf, IsArray, ArrayNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationRequestDto } from 'src/common/dto/pagination-request.dto';
import { ApiProperty } from '@nestjs/swagger';
import { DateTransform } from 'src/common/decorator/date-transform.decorator';

export class GettingAlarmHistoryStatisticsDto {

  @ApiProperty({ description: '알람발생-조회시작일', default: '2024-01-01', type: Date, required: false })
  @DateTransform()
  startDate: Date;

  @ApiProperty({ description: '알람발생-조회종료일', default: '2025-12-31', type: Date, required: false })
  @DateTransform()
  endDate: Date;
}