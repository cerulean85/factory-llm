import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { DateTransform } from "src/common/decorator/date-transform.decorator";
import { PaginationRequestDto } from "src/common/dto/pagination-request.dto";
import { OPERATION_MAINTENANCE_TYPE } from "src/common/enum/equipment.enum";

export class FilteringEquipmentOperationMaintenanceDto extends PaginationRequestDto {

  @ApiProperty({ description: '가동 보수 이력 ID', default: -1, type: Number, required: false })
  @IsOptional()
  @IsNumber()
  equipmentOperationMaintenanceId: number;

  @ApiProperty({ description: '조회 시작 날짜', default: undefined, example: '2025-07-10T08:00:00', type: Date })
  @IsOptional()
  @DateTransform()
  startDate: Date | undefined;

  @ApiProperty({ description: '조회 종료 날짜', default: undefined, example: '2025-07-10T10:00:00', type: Date })
  @IsOptional()
  @DateTransform()
  endDate: Date | undefined;

  @ApiProperty({ description: '가동 보수 유형', example: OPERATION_MAINTENANCE_TYPE.DEFAULT, enum: OPERATION_MAINTENANCE_TYPE, required: false})
  @IsOptional()
  @IsEnum(OPERATION_MAINTENANCE_TYPE)
  operationMaintenanceType: OPERATION_MAINTENANCE_TYPE;

  @ApiProperty({ description: '상세설명', default: '', type: String, required: false })
  @IsOptional()
  @Type(() => String)
  @IsString()
  description: string;

  @ApiProperty({ description: '설비 ID', default: -1, type: Number, required: false })
  @IsOptional()
  @IsNumber()
  equipmentId: number;
}