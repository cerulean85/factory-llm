import { ApiProperty } from "@nestjs/swagger";
import { FilteringAlarmHistoryDto } from "../../../../alarm/history/alarm-history/dto/request/filtering-alarm-history.dto";
import { IsNumber, IsOptional, IsString, Length } from "class-validator";

export class FilteringLongTermItemAlarmHistoryDto extends FilteringAlarmHistoryDto{
  @ApiProperty({ description: '알람 ID', default: -1, type: Number, required: false })
  @IsOptional()
  @IsString()
  standardType: number;
}