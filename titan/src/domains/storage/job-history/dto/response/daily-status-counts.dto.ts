import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

export class DailyStatusCountsDto {
  @ApiProperty({ example: '2025-05-07', description: '날짜' })
  @Expose()
  date: string = '';
 
  @ApiProperty({ example: 25, description: '출고 개수' })
  @Expose()
  currentCount: number = -1;

  @ApiProperty({ example: 50, description: '누적 출고 개수' })
  @Expose()
  cumulativeCount: number = -1;
}