import { Expose, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { ALERT_TYPE, INVENTORY_ALARM_TYPE } from 'src/common/enum/alarm.enum';
import { WAREHOUSE_TYPE } from 'src/common/enum/equipment.enum';

export class InventoryAlarmHistoryResponseDto {
  @ApiProperty({ description: '재고 알람 내역 번호', default: -1, type: Number })
  @Expose()
  @Transform(({ obj }) => obj.id)
  inventoryAlarmHistoryId: number = -1;

  @ApiProperty({ description: '알람유형', default: '', type: String })
  @Expose()
  @Transform(({ obj }) => obj.standard_type)
  standardType: string = "";

  @ApiProperty({ description: '재고개수', default: 0, type: Number })
  @Expose()
  @Transform(({ obj }) => obj.stored_item_count)
  storedItemCount: number = 0;

  @ApiProperty({ description: '재고 알람 타입', default: INVENTORY_ALARM_TYPE.STORED, example: INVENTORY_ALARM_TYPE.STORED, enum: INVENTORY_ALARM_TYPE})
  @Expose()
  @Transform(({ obj }) => obj.inventory_alarm_type)
  inventoryAlarmType: INVENTORY_ALARM_TYPE;

  @ApiProperty({ description: '경고 수준', default: ALERT_TYPE.WARNING, example: ALERT_TYPE.WARNING, enum: ALERT_TYPE})
  @Expose()
  @Transform(({ obj }) => obj.alert_type)
  alertType: ALERT_TYPE;

  @ApiProperty({ description: '창고 이름', default: '', example: 'warehouseName', type: String })
  @Expose()
  warehouseName: string = '';

  @ApiProperty({ description: '창고 코드', default: '', example: 'warehouseCode', type: String })
  @Expose()
  warehouseCode: string = '';

  @ApiProperty({ description: '창고 유형', default: WAREHOUSE_TYPE.ETC, example: WAREHOUSE_TYPE.ETC, enum: WAREHOUSE_TYPE })
  @Expose()
  warehouseType: WAREHOUSE_TYPE = WAREHOUSE_TYPE.ETC
}