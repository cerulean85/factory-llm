import { ApiProperty } from "@nestjs/swagger";
import { FilteringAlarmHistoryDto } from "../../../alarm-history/dto/request/filtering-alarm-history.dto";
import { IsNumber, IsOptional } from "class-validator";

export class FilteringPalletAlarmHistoryDto extends FilteringAlarmHistoryDto{
  @ApiProperty({ description: '알람 내역 ID', default: -1, type: Number, required: false })
  @IsOptional()
  @IsNumber()
  alarmHistoryId: number = -1;
}