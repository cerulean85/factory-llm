import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class PalletGroupsResponseDto {
  @ApiProperty({ description: '팔레트 구간 별 그룹', default: '', type: String })
  @Expose()
  name: string;
 
  @ApiProperty({ description: '전체 데이터 개수', default: -1, type: Number })
  @Expose()
  recordCount: number;

  @ApiProperty({ description: '현재 남은 재고 개수', default: -1, type: Number })
  @Expose()
  productCount: number;

  @ApiProperty({ description: '현재 남은 재고 비율', default: '', type: Number })
  @Expose()
  average: number;
}