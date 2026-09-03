import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';
import { DateTransform } from 'src/common/decorator/date-transform.decorator';
import { PaginationRequestDto } from 'src/common/dto/pagination-request.dto';

export class GettingEquipmentOperationStatusDto {
  @ApiProperty({
    description: '조회 시작 날짜',
    default: '2025-03-01',
    type: String,
  })
  startDate: string;

  @ApiProperty({
    description: '조회 종료 날짜',
    default: '2025-03-31',
    type: String,
  })
  endDate: string;
}
