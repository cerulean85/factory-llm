import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CraneCellCurrentStackedCountsDto {
  @ApiProperty({ description: '현재 재고 수량', default: -1, type: Number })
  @Expose()
  currentCount: number;

  @ApiProperty({ description: '총 재고 수량', default: -1, type: Number })
  @Expose()
  totalCount: number;

  @ApiProperty({ description: '재고 비율', default: -1, type: Number })
  @Expose()
  rate: number;

  @ApiProperty({ description: '공 쉘프 수', default: -1, type: Number })
  @Expose()
  emptyCellCount: number;
}
