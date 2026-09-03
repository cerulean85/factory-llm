import { Transform, Expose, Type } from 'class-transformer';
import { IsString, Length, IsOptional, IsInt, ValidateIf, IsDate, IsBoolean, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateMessageDispatchHistoryDto } from '../../history/message-dispatch-history/dto/request/create-message-dispatch-history.dto';

export class CreateAlarmSmsDto  {
  @ApiProperty({ description: '전송 내용', default: '', example: '알람이 발생되었습니다.', type: String })
  @Expose()
  @IsString()
  @Length(0, 500)
  @IsOptional()
  message: string = '';

  @ApiProperty({ name: 'phoneNumber', description: '국제전화번호', example: '821012341234', default: '', type: String })
  @Expose({ name: 'phoneNumber' })
  @Transform(({ value }) => value.replace(/[^0-9]/g, ''))
  @IsString()
  @Matches(/^[0-9]{10,12}$/, {message: 'Phone number must be 10 to 12 digits.'})
  @IsOptional()
  phone_number: string = "";
  
  @ApiProperty({ name: 'alarmHistoryId', description: '히스토리 ID', default: 1, example: 1, type: Number })
  @Expose({ name: 'alarmHistoryId' })
  @IsInt()
  alarm_history_id: number;

  @ApiProperty({ name: 'usersSeqId', description: '전송 Seq ID', default: 1, example: 1, type: Number })
  @Expose({ name: 'usersSeqId' })
  @IsInt()
  users_seq_id: number;
}