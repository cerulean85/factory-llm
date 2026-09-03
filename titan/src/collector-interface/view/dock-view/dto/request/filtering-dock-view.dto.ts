import { IsString, IsOptional, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class FilteringDockViewDto {
  @ApiProperty({ description: 'Dock ID', default: -1, type: Number })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  dockId: number;

  @ApiProperty({ description: 'Gantry Code', default: -1, type: Number })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  gantryCode: number;

  @ApiProperty({ description: '출고 상태', default: '', type: String })
  @IsOptional()
  @Type(() => String)
  @IsString()
  status: string;
}