import { IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

//알람 유효성 검증
export class CheckAlarmDto {
  @ApiProperty({ description: '알람 코드', example: "alarm-code", default: '', type: String })
  @IsString()
  @Type(() => String)
  alarmCode: string;

  @ApiProperty({ description: '설비 타입 ID', example: "1", default: '', type: String })
  @IsNumber()
  @Type(() => Number)
  equipmentTypeId: number;
}