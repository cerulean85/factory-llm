import { ApiProperty } from '@nestjs/swagger'
import { Expose, Transform, Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsOptional } from 'class-validator';
import { CELL_STATUS } from 'src/common/enum/cell.enum';

export class UpdateGantryCellDto {
  @ApiProperty({ name: 'enabale', description: '사용 여부', example: true, default: true, type: Boolean})
  @IsOptional()
  @Expose()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  enable: boolean;

  @ApiProperty({ description: 'Cell 상태', default: CELL_STATUS.NORMAL, enum: CELL_STATUS, required: false })
  @IsOptional()
  @Expose({ name: 'cellStatus' })
  @IsEnum(CELL_STATUS)
  cell_status: CELL_STATUS;
}