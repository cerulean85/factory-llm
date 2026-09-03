import { ApiProperty } from "@nestjs/swagger";
import { CreateAlarmHistoryDto } from "../../../../alarm/history/alarm-history/dto/request/create-alarm-history.dto";
import { Expose, Type } from "class-transformer";
import { IsInt, IsOptional, IsString } from "class-validator";

export class CreateLongTermItemAlarmHistoryDto extends CreateAlarmHistoryDto {
  @ApiProperty({ name: 'warehouseId', description: '창고 ID', default: 1, example: 1, type: Number })
  @Expose({ name: 'warehouseId' })
  @IsOptional()
  @IsInt()
  warehouse_id: number;

  @ApiProperty({ description: '타이어 규격', example: '', default: '', type: String })
  @IsString()
  @Type(() => String)
  standard_type: string;

  @ApiProperty({ name: 'longTermItemCount', description: '장기 재고 개수', default: 1, example: 1, type: Number })
  @Expose({ name: 'longTermItemCount' })
  @IsOptional()
  @IsInt()
  long_term_item_count: number;
}