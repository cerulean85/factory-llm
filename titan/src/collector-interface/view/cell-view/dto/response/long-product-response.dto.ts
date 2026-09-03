import { Expose } from 'class-transformer';
import { LongProductItemsResponseDto } from './long-product-items-response.dto';
import { ApiProperty } from '@nestjs/swagger';

export class LongProductResponseDto {
  @ApiProperty({ description: '장기재고명', default: '', type: String })
  @Expose()
  name: string;

  @ApiProperty({ description: '총 재고 개수', default: -1, type: Number })
  @Expose()
  totalCount: number;
 
  @ApiProperty({ description: '장기 재고 기간별 그룹', default: [], type: [LongProductItemsResponseDto] })
  @Expose()
  items: LongProductItemsResponseDto[];

  @ApiProperty({ description: '장기 재고 그룹별 비율', default: -1, type: Number })
  @Expose()
  nameRate: number;
}