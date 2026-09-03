import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ItemMasterViewResponseDto {
  @ApiProperty({ description: 'sku_key', example: '111', default: '', type: String})
  @Expose({ name: 'sku_key' })
  skuKey: string = '';

  @ApiProperty({ description: 'standard_type', example: 'type', default: '', type: String})
  @Expose({ name: 'standard_type' })
  standardType: string = '';
}