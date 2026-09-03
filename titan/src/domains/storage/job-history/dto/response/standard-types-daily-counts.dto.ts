import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

class StandardTypesItemsDto {
  @ApiProperty({ description: '타이어 규격' })
  @Expose()
  standardType: string = '';

  @ApiProperty({ description: '출고 개수' })
  @Expose()
  recordCount: number = -1;
}

export class StandardTypesDailyCountsDto {
  @ApiProperty({ example: '2025-05-07', description: '날짜' })
  @Expose()
  date: string = '';

  @ApiProperty({ example: new StandardTypesItemsDto(), description: '타이어 규격 및 출고 개수' })
  @Expose()
  items: StandardTypesItemsDto[] = [];
}