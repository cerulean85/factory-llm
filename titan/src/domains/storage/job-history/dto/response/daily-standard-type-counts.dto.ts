import { ApiProperty } from '@nestjs/swagger';

export class DailyStandardTypeCountsDto {
  @ApiProperty({ example: '2025-05-07', description: '날짜' })
  date: string = '';

  @ApiProperty({ example: '1d-356-86', description: '타이어 규격' })
  standardType: string = '';

  @ApiProperty({ example: 150, description: '출고 수량' })
  recordCount: number = -1;
}