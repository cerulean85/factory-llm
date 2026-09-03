import { Expose, Type } from 'class-transformer';
import { IsString, Length, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { DateTransform } from 'src/common/decorator/date-transform.decorator';
import { ALARM_HISTORY_TYPE } from 'src/common/enum/alarm.enum';

export class CreateAlarmHistoryDto {
  @ApiProperty({ description: '알람 내역 메시지', default: '', type: String })
  @Expose()
  @IsString()
  @IsOptional()
  @Length(1, 100)
  message: string = '';

  @ApiProperty({ name: 'processDate', description: '알람 조치일자', default: null, type: String })
  @Expose({ name: 'processDate' })
  @DateTransform()
  @IsOptional()
  process_date: Date | null = null;

  @ApiProperty({ name: 'processDate', description: '알람 조치일자', default: '', type: String })
  @Expose({ name: 'processDate' })
  @Type(() => String)
  @IsOptional()
  @Length(0, 300)
  process_message: string = '';

  @ApiProperty({ name: 'type', description: '알람 타입', default: ALARM_HISTORY_TYPE.EQUIPMENT, enum: ALARM_HISTORY_TYPE})
  @Expose({ name: 'type' })
  @IsEnum(ALARM_HISTORY_TYPE)
  @IsOptional()
  @Length(0, 10)
  type: ALARM_HISTORY_TYPE;
}