import { ApiProperty } from "@nestjs/swagger";
import { CreateAlarmHistoryDto } from "../../../alarm-history/dto/request/create-alarm-history.dto";
import { Expose } from "class-transformer";
import { IsInt, IsOptional, IsString, Length } from "class-validator";

export class CreatePalletAlarmHistoryDto extends CreateAlarmHistoryDto {
  @ApiProperty({ name: 'palletCode', description: 'pallet code', default: "", example: "rfid8349", type: String })
  @Expose({ name: 'palletCode' })
  @IsOptional()
  @IsString()
  @Length(0, 50)
  pallet_code: string;

  @ApiProperty({ name: 'warningCount', description: 'warning count', default: 0, example: 0, type: Number })
  @Expose({ name: 'warningCount' })
  @IsOptional()
  @IsInt()
  warning_count: number;  
}