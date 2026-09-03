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

export class DailyShippingSpecificationDto {
  @ApiProperty({ example: '2023-10-01', description: '날짜' })
  @Expose()
  date: string = '';

  @ApiProperty({ example: new StandardTypesItemsDto(), description: '타이어 규격 별 개수' })
  @Expose()
  items: StandardTypesItemsDto[] = [];
}