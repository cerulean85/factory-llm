import { ApiProperty } from "@nestjs/swagger";
import { Expose, plainToInstance, Transform, Type } from "class-transformer";
import { AlarmHistoryBaseResponseDto } from "./alarm-history-base-response.dto";
import { InventoryAlarmHistoryResponseDto } from "../../sub-domain/inventory-alarm-history/dto/response/inventory-alarm-history-response.dto";
import { EquipmentAlarmHistoryResponseDto } from "../../sub-domain/equipment-alarm-history/dto/response/equipment-alarm-history-response.dto";

export class AggregatedAlarmHistoryResponseDto {
  @ApiProperty({ description: '알람 히스토리 정보', type: () => AlarmHistoryBaseResponseDto })
  @Expose()
  @Type(() => AlarmHistoryBaseResponseDto)
  @Transform(
    ({ obj }) =>
      plainToInstance(AlarmHistoryBaseResponseDto, obj, { excludeExtraneousValues: true }),
    { toClassOnly: true },
  )
  alarmHistory: AlarmHistoryBaseResponseDto;

  @ApiProperty({ description: '설비 알람 히스토리 정보', type: () => EquipmentAlarmHistoryResponseDto })
  @Expose({ name: 'equipment_alarm_history' })
  @Type(() => EquipmentAlarmHistoryResponseDto)
  equipmentAlarmHistory: EquipmentAlarmHistoryResponseDto;

  
  @ApiProperty({ description: '재고 알람 히스토리 정보', type: () => InventoryAlarmHistoryResponseDto })
  @Expose({ name: 'inventory_alarm_history' })
  @Type(() => InventoryAlarmHistoryResponseDto)
  inventoryAlarmHistory: InventoryAlarmHistoryResponseDto;
}