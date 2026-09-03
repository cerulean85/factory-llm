import { IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class FilteringItemMasterViewDto {
  @ApiProperty({ description: 'sku_key', default: '', type: String })
  @IsOptional()
  @Type(() => String)
  @IsString()
  skuKey: string;

  @ApiProperty({ description: 'standard_type', default: '', type: String })
  @IsOptional()
  @Type(() => String)
  @IsString()
  standardType: string;
}