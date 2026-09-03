import { Transform, Expose, Type } from 'class-transformer';
import { IsString, Length, IsOptional, IsInt, ValidateIf, IsDate, IsBoolean, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { SEND_MESSAGE_TYPE } from 'src/common/enum/alarm.enum';

export class CreateMessageDispatchHistoryDto {
  @ApiProperty({ name: 'type', description: '전송 타입', example: 'SMS', default: SEND_MESSAGE_TYPE.SMS, enum: SEND_MESSAGE_TYPE })
  @Expose({ name: 'type' })
  @Type(() => String)
  @IsEnum(SEND_MESSAGE_TYPE)
  type: SEND_MESSAGE_TYPE = SEND_MESSAGE_TYPE.SMS;


  @ApiProperty({ description: '전송 내용', default: '', example: '알람이 발생되었습니다.', type: String })
  @Expose()
  @IsString()
  @Length(0, 500)
  @IsOptional()
  message: string = '';
  
  @ApiProperty({ description: '전송 성공 여부' })
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  @Expose({ name: 'dispatchSuccess' })
  dispatch_success: boolean = false;
  
  @ApiProperty({ name: 'alarmHistoryId', description: '히스토리 ID', default: 1, example: 1, type: Number })
  @Expose({ name: 'alarmHistoryId' })
  @IsInt()
  alarm_history_id: number;


  @ApiProperty({ name: 'usersSeqId', description: '전송 Seq ID', default: 1, example: 1, type: Number })
  @Expose({ name: 'usersSeqId' })
  @IsInt()
  users_seq_id: number;
}