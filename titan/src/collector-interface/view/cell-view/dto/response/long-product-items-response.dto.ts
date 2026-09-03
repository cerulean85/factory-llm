import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class LongProductItemsResponseDto {
  
  @ApiProperty({ description: '타이어 규격', default: '', type: String })
  @Expose()
  types: string[];
 
  @ApiProperty({ description: '재고 개수', default: -1, type: Number })
  @Expose()
  totalCount: number;

  @ApiProperty({ description: '장기 재고 기간별 그룹', default: '', type: String })
  @Expose()
  name: string;

  @ApiProperty({ description: '장기 재고 중 규격별 비중', default: -1, type: Number })
  @Expose()
  typeRate: number;
}
