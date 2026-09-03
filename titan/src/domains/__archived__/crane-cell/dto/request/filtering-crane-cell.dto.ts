import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsBoolean, IsEnum, IsNumber, IsOptional } from "class-validator";
import { CELL_STATUS } from "src/common/enum/cell.enum";

export class FilteringCraneCellDto {
  @ApiProperty({ description: '크레인 셀 ID', default: -1, type: Number, required: false })
  @IsOptional()
  @IsNumber()
  craneCellId: number;

  @ApiProperty({ description: '크레인 셀 사용 여부', default: false, type: Boolean, required: false })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  enable: boolean;

  @ApiProperty({ description: '설비 ID', default: -1, type: Number, required: false })
  @IsOptional()
  @IsNumber()
  equipmentId: number;

  @ApiProperty({ description: 'Bank', default: 0, type: Number, required: false })
  @IsOptional()
  @IsNumber()
  bank: number;

  @ApiProperty({ description: 'Bay', default: 0, type: Number, required: false })
  @IsOptional()
  @IsNumber()
  bay: number;

  @ApiProperty({ description: 'Level', default: 0, type: Number, required: false })
  @IsOptional()
  @IsNumber()
  level: number;

  @ApiProperty({ description: 'Cell 상태', default: CELL_STATUS.NORMAL, enum: CELL_STATUS, required: false })
  @IsOptional()
  @IsEnum(CELL_STATUS)
  cellStatus: CELL_STATUS;
}