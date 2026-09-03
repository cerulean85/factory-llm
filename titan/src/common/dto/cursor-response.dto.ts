import { ApiProperty } from '@nestjs/swagger';

export class CursorResponseDto<T> {
  @ApiProperty({
    description: '결과 데이터 배열',
    isArray: true,
    type: () => Object,
  })
  data: T[];

  @ApiProperty({ description: '전체 개수', example: 123 })
  total: number;

  @ApiProperty({ description: '요청 기준값(ID)', example: 123 })
  cursor: number;

  @ApiProperty({ description: '이후 데이터 여부', example: false })
  hasMore: boolean;

  constructor(data: T[], total: number, cursor: number, hasMore: boolean) {
    this.data = data ? data : [];
    this.total = total ?? -1;
    this.cursor = cursor ?? -1;
    this.hasMore = hasMore ?? false;
  }
}