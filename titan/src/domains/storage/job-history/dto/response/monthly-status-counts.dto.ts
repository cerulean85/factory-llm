import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

export class MonthlyStatusCountsDto {
  @ApiProperty({ example: 1, description: '창고 ID' })
  @Expose()
  warehouseId: number = -1;
 
  @ApiProperty({ example: 25, description: 'Pallet 입고량'})
  @Expose()
  palletInCount: number = -1;

  @ApiProperty({ example: 25, description: 'Pallet 출고량'})
  @Expose()
  palletOutCount: number = -1;

  @ApiProperty({ example: 25, description: 'tire(item) 입고량' })
  @Expose()
  tireInCount: number = -1;

  @ApiProperty({ example: 25, description: 'tire(item) 출고량' })
  @Expose()
  tireOutCount: number = -1;
}