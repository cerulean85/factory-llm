import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class MonthShipmentDto {
  @ApiProperty({ description: '타이어 규격', default: '', type: String })
  @Expose()
  standardType: string = "";

  @ApiProperty({ description: '월별 출하 개수', default: -1, type: Number })
  @Expose()
  outCount: number = -1;

  @ApiProperty({ description: '월별 재고 개수', default: -1, type: Number })
  @Expose()
  stackedCount: number = -1;
}
