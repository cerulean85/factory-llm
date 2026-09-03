import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

export class InOutCountsByStandardTypeDto {
  @ApiProperty({ example: 'winter-03-12', description: '품목명' })
  @Expose()
  standardType: string = '';
 
  @ApiProperty({ example: 25, description: '출고 개수' })
  @Expose()
  outCount: number = 0;

  @ApiProperty({ example: 50, description: '입고 개수' })
  @Expose()
  stackedCount: number = 0;   //inCount로 수정해야할 듯.
}