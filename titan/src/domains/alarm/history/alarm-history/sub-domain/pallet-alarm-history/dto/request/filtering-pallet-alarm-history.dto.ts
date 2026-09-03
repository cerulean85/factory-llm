import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional } from "class-validator";

export class FilteringPalletAlarmHistoryDto {
  // @ApiProperty({ description: '알람 내역 ID', default: -1, type: Number, required: false })
  // @IsOptional()
  // @IsNumber()
  // alarmHistoryId: number = -1;
}