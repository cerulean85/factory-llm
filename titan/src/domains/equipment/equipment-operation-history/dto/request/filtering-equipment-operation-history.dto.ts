import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsArray, IsDate, IsEnum, IsNumber, IsOptional, IsString, ValidateIf } from "class-validator";
import { DateTransform } from "src/common/decorator/date-transform.decorator";
import { PaginationRequestDto } from "src/common/dto/pagination-request.dto";
import { EQUIPMENT_TYPE, OPERATION_MAINTENANCE_TYPE, OPERATION_STATUS } from "src/common/enum/equipment.enum";

export class FilteringEquipmentOperationHistoryDto extends PaginationRequestDto {
  @ApiProperty({ description: '조회 시작 날짜', default: '', type: Date })
  @IsOptional()
  @DateTransform()
  startDate: Date | undefined;

  @ApiProperty({ description: '조회 종료 날짜', default: '', type: Date })
  @IsOptional()
  @DateTransform()
  endDate: Date | undefined;

  @ApiProperty({ description: '가동 내역 ID', default: -1, type: Number, required: false })
  @IsOptional()
  @IsNumber()
  equipmentOperationHistoryId: number;

  @ApiProperty({ description: '가동 상태', enum: OPERATION_STATUS, required: false })
  @IsOptional()
  @IsEnum(OPERATION_STATUS)
  operationStatus: OPERATION_STATUS;

  @ApiProperty({ description: '가동 보수 유형', enum: OPERATION_MAINTENANCE_TYPE, required: false})
  @IsOptional()
  @IsEnum(OPERATION_MAINTENANCE_TYPE)
  operationMaintenanceType: OPERATION_MAINTENANCE_TYPE;

  @ApiProperty({ description: '설비 ID', default: -1, type: Number, required: false })
  @IsOptional()
  @IsNumber()
  equipmentId: number;

  @ApiProperty({ description: '설비 타입', enum: EQUIPMENT_TYPE, isArray: true, required: false })
  @IsOptional()
  @IsArray()
  @IsEnum(EQUIPMENT_TYPE, { each: true })
  equipmentType: EQUIPMENT_TYPE[];
}