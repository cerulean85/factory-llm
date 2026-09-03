import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsBoolean, IsEnum, IsNumber, IsOptional } from "class-validator";
import { FilteringDateDto } from "src/common/dto/filtering-date.dto";
import { CELL_STATUS } from "src/common/enum/cell.enum";

export class FilteringGantryCellDto extends FilteringDateDto {
  @ApiProperty({ description: '갠트리 셀 ID', default: -1, type: Number, required: false })
  @IsOptional()
  @IsNumber()
  gantryCellId: number;

  @ApiProperty({ description: '창고 ID', default: -1, type: Number, required: false })
  @IsOptional()
  @IsNumber()
  warehouseId: number;

  @ApiProperty({ description: '갠트리 셀 사용 여부', default: false, type: Boolean, required: false })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  enable: boolean;

  @ApiProperty({ description: 'Bank', default: 0, type: Number, required: false })
  @IsOptional()
  @IsNumber()
  bank: number;

  @ApiProperty({ description: 'Bay', default: 0, type: Number, required: false })
  @IsOptional()
  @IsNumber()
  bay: number;

  @ApiProperty({ description: 'port', default: 0, type: Number, required: false })
  @IsOptional()
  @IsNumber()
  port: number;

  @ApiProperty({ description: 'Cell 상태', default: CELL_STATUS.NORMAL, enum: CELL_STATUS, required: false })
  @IsOptional()
  @IsEnum(CELL_STATUS)
  cellStatus: CELL_STATUS;

  @ApiProperty({ description: 'Equipment ID', default: -1, type: Number, required: false })
  @IsOptional()
  @IsNumber()
  equipmentId: number;
}