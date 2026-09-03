import { ApiProperty } from "@nestjs/swagger";
import { FilteringAlarmHistoryDto } from "../../../../dto/request/filtering-alarm-history.dto";
import { IsEnum, IsOptional, IsString, Length } from "class-validator";
import { INVENTORY_ALARM_TYPE } from "src/common/enum/alarm.enum";
import { WAREHOUSE_TYPE } from "src/common/enum/equipment.enum";

export class FilteringInventoryAlarmHistoryDto {
  @ApiProperty({ description: '타이어 타입', default: '', type: String, required: false })
  @IsOptional()
  @IsString()
  @Length(0, 30)
  standardType: string;

  @ApiProperty({ name: 'inventoryAlarmType', description: '재고 알람 타입', default: INVENTORY_ALARM_TYPE.STORED, example: INVENTORY_ALARM_TYPE.STORED, enum: INVENTORY_ALARM_TYPE, required: false})
  @IsOptional()
  @IsEnum(INVENTORY_ALARM_TYPE)
  inventoryAlarmType: INVENTORY_ALARM_TYPE;

  @ApiProperty({ name: 'warehouseName', description: '창고 이름', default: '', type: String, required: false })
  @IsOptional()
  @IsString()
  @Length(0, 50)
  warehouseName: string;

  @ApiProperty({ name: 'warehouseCode', description: '창고 코드', default: '', type: String, required: false })
  @IsOptional()
  @IsString()
  @Length(0, 50)
  warehouseCode: string;

  @ApiProperty({ name: 'warehouseType', description: '창고 유형', default: WAREHOUSE_TYPE.ETC, enum: WAREHOUSE_TYPE, required: false })
  @IsOptional()
  @IsEnum(WAREHOUSE_TYPE)
  warehouseType: WAREHOUSE_TYPE;
}