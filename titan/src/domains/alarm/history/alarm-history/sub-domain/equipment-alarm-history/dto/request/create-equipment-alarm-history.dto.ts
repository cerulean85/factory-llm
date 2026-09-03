import { ApiProperty } from "@nestjs/swagger";
import { CreateAlarmHistoryDto } from "../../../../dto/request/create-alarm-history.dto";
import { Expose } from "class-transformer";
import { IsInt, IsOptional, IsString } from "class-validator";

export class CreateEquipmentAlarmHistoryDto extends CreateAlarmHistoryDto {
  @ApiProperty({ name: 'alarmId', description: 'alarm ID', default: 1, example: 1, type: Number })
  @Expose({ name: 'alarmId' })
  @IsOptional()
  @IsInt()
  alarm_id: number;

  @ApiProperty({ name: 'alarmHistoryId', description: 'alarm history ID', default: 1, example: 1, type: Number })
  @Expose({ name: 'alarmHistoryId' })
  @IsOptional()
  @IsInt()
  alarm_history_id: number;

  @ApiProperty({ name: 'equipmentName', description: '설비 이름', default: '', example: '', type: String })
  @Expose({ name: 'equipmentName' })
  @IsOptional()
  @IsString()
  equipment_name: string;

  @ApiProperty({ name: 'equipmentCode', description: '설비 코드', default: '', example: '', type: String })
  @Expose({ name: 'equipmentCode' })
  @IsOptional()
  @IsString()
  equipment_code: string;
}