import { ApiProperty } from '@nestjs/swagger'
import { Expose, Type } from 'class-transformer';
import { IsString, Length, IsOptional } from 'class-validator';

export class CreateStoredItemDto {
  @ApiProperty({ name: 'standardType', description: '타이어 규격', example: '1d-356-86', default: '', type: String })
  @Expose({ name: 'standardType' })
  @Type(() => String)
  @Length(1, 100)
  @IsString()
  standard_type: string;

  @ApiProperty({ name: 'detail', description: '', default: '', example: '상세 데이터', type: String })
  @Expose()
  @IsString()
  @IsOptional()
  detail: string;

  @ApiProperty({ name: 'skuId', description: '적재 아이템 고유 번호', default: '', example: '123abc', type: String })
  @Expose({ name: 'skuId' })
  @IsString()
  @IsOptional()
  sku_id: string;
}