import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsBoolean, IsEnum, IsNumber, IsOptional } from "class-validator";
import { PaginationRequestDto } from "src/common/dto/pagination-request.dto";
import { CELL_USE_TYPE } from "src/common/enum/equipment.enum";

export class FilteringRealtimeWarehouseViewDto extends PaginationRequestDto {
  @ApiProperty({ description: 'ID', default: -1, type: Number })
  @IsOptional()
  @IsNumber()
  id: number;

  @ApiProperty({ description: 'loaded', default: true, type: Boolean })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  loaded: boolean;

  @ApiProperty({ description: 'shelf 사용 유형', default: CELL_USE_TYPE.NORMAL, enum: CELL_USE_TYPE })
  @IsOptional()
  @IsEnum(CELL_USE_TYPE)
  useType: CELL_USE_TYPE;

  @ApiProperty({ name: 'warehouseId', description: '창고 ID', example: 1, default: 0, type: Number })
  @IsOptional()
  @IsNumber()
  warehouseId: number;
}