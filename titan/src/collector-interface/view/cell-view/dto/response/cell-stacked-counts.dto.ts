import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CellStackedCountsDto {
  @ApiProperty({ description: '창고 ID', default: -1, type: Number })
  @Expose()
  warehouseId: number = -1;

  @ApiProperty({ description: 'StackArea (STC:Equipment기준, GTR:Warehouse기준)', default: '', type: String })
  @Expose()
  stackAreaCode: string = '';

  @ApiProperty({ description: '현재 개수', example: 1, default: -1, type: Number})
  @Expose()
  currentCount: number = -1;

  @ApiProperty({ description: '규격 이름 및 개수', example: [['A', 1], ['B', 4]], default: [], type: Array})
  @Expose()
  standardTypes: [] = [];

  @ApiProperty({ description: '전체 개수', example: 1, default: -1, type: Number})
  @Expose()
  totalCount: number = -1;

  @ApiProperty({ description: '금지 셀 수', example: 1, default: -1, type: Number})
  @Expose()
  disabledCount: number = -1;

  @ApiProperty({ description: 'Check 셀 수', example: 1, default: -1, type: Number})
  @Expose()
  checkCount: number = -1;    //현재로서는 받을 수 없는 정보

  @ApiProperty({ description: '빈 쉘프 수', example: 1, default: -1, type: Number})
  @Expose()
  emptyCellCount: number = -1;

  @ApiProperty({ description: '규격 개수', example: 1, default: -1, type: Number})
  @Expose()
  standardTypeCount: number = -1;
}