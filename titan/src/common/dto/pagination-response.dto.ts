import { ApiProperty } from '@nestjs/swagger';

export class PaginationResponseDto<T> {
  @ApiProperty({
    description: '결과 데이터 배열',
    isArray: true,
    type: () => Object, // 여기는 구체화된 클래스에서 오버라이드 가능
  })
  data: T[];

  @ApiProperty({ description: '전체 개수', example: 123 })
  total: number;

  @ApiProperty({ description: '전체 페이지 수', example: 13 })
  totalPages: number;

  @ApiProperty({ description: '현재 페이지 번호', example: 1 })
  currentPage: number;

  constructor(data: T[], total: number, limit: number, page: number) {
    this.data = data ? data : [];
    this.total = total ?? -1;
    this.totalPages = total ? Math.ceil(total / limit) : -1;
    this.currentPage = page ?? -1;
  }
}