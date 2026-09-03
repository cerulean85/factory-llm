import { Expose, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CommonUserInfoDto } from 'src/common/dto/user-info.dto';
import { WAREHOUSE_TYPE } from 'src/common/enum/equipment.enum';

export class LongTermItemAlarmHistoryResponseDto {
  @ApiProperty({ description: '장기 재고 알람 내역 번호', default: -1, type: Number })
  @Expose()
  @Transform(({ obj }) => obj.id)
  longTermItemAlarmHistoryId: number = -1;

  @ApiProperty({ description: '창고 ID', default: -1, type: Number })
  @Expose()
  @Transform(({ obj }) => obj.warehouse?.id)
  warehouseId: number = -1;

  @ApiProperty({ description: '창고 타입', default: WAREHOUSE_TYPE.ETC, enum: WAREHOUSE_TYPE })
  @Expose()
  @Transform(({ obj }) => obj.warehouse?.type)
  warehouseType: WAREHOUSE_TYPE = WAREHOUSE_TYPE.ETC;

  @ApiProperty({ description: '타이어 규격', default: '', type: String })
  @Expose()
  @Transform(({ obj }) => obj.standard_type)
  standardType: string = "";

  @ApiProperty({ description: '장기 재고 개수', default: 0, type: Number })
  @Expose()
  @Transform(({ obj }) => obj.long_term_item_count)
  longTermItemCount: number = 0;
}