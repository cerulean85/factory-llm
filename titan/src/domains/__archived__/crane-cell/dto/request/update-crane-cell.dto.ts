import { ApiProperty } from "@nestjs/swagger";
import { Expose, Transform, Type } from "class-transformer";
import { IsBoolean, IsEnum, IsOptional } from "class-validator";
import { CELL_STATUS } from "src/common/enum/cell.enum";

export class UpdateCraneCellDto {
  @ApiProperty({ description: '셀 사용여부', example: true, default: true, type: Boolean, required: false })
  @Expose()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  enable: boolean;

  @ApiProperty({ description: 'Cell 상태', default: CELL_STATUS.NORMAL, enum: CELL_STATUS, required: false })
  @Expose({ name: 'cellStatus' })
  @IsOptional()
  @IsEnum(CELL_STATUS)
  cell_status: CELL_STATUS;
}