import { ApiProperty } from "@nestjs/swagger";
import { CreateAlarmHistoryDto } from "../../../../dto/request/create-alarm-history.dto";
import { Expose } from "class-transformer";
import { IsEnum, IsInt, IsOptional, IsString, Length } from "class-validator";
import { ALERT_TYPE, INVENTORY_ALARM_TYPE } from "src/common/enum/alarm.enum";
import { WAREHOUSE_TYPE } from "src/common/enum/equipment.enum";

export class CreateInventoryAlarmHistoryDto extends CreateAlarmHistoryDto {
  @ApiProperty({ name: 'standardType', description: '타이어 타입', default: "", example: "SC-A0-123", type: String })
  @Expose({ name: 'standardType' })
  @IsOptional()
  @IsString()
  @Length(0, 100)
  standard_type: string;

  @ApiProperty({ name: 'storedItemCount', description: '적치 개수', default: 0, example: 99, type: Number})
  @Expose({name: 'storedItemCount'})
  @IsOptional()
  @IsInt()
  stored_item_count: number;

  @ApiProperty({ name: 'inventoryAlarmType', description: '재고 알람 타입', default: INVENTORY_ALARM_TYPE.STORED, example: INVENTORY_ALARM_TYPE.STORED, enum: INVENTORY_ALARM_TYPE})
  @Expose({name: 'inventoryAlarmType'})
  @IsOptional()
  @IsEnum(INVENTORY_ALARM_TYPE)
  inventory_alarm_type: INVENTORY_ALARM_TYPE;

  @ApiProperty({ name: 'alertType', description: '알람 타입', default: null, example: ALERT_TYPE.WARNING, enum: ALERT_TYPE})
  @Expose({name: 'alertType'})
  @IsOptional()
  @IsEnum(ALERT_TYPE)
  alert_type: ALERT_TYPE;

  @ApiProperty({ name: 'warehouseName', description: '창고 이름', default: '', example: '창고 이름', type: String })
  @Expose({name: 'warehouseName'})
  @IsOptional()
  @IsString()
  @Length(0, 50)
  warehouse_name: string;
  
  @ApiProperty({ name: 'warehouseCode', description: '창고 코드', default: '', example: '창고 코드', type: String })
  @Expose({name: 'warehouseCode'})
  @IsOptional()
  @IsString()
  @Length(0, 50)
  warehouse_code: string;

  @ApiProperty({ name: 'warehouseType', description: '창고 유형', default: WAREHOUSE_TYPE.ETC, example: WAREHOUSE_TYPE.ETC, enum: WAREHOUSE_TYPE})
  @Expose({name: 'warehouseType'})
  @IsOptional()
  @IsEnum(WAREHOUSE_TYPE)
  warehouse_type: WAREHOUSE_TYPE;
}