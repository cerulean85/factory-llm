import { Expose } from 'class-transformer';
import { IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAlarmHistoryProcessByUserDto {
  @ApiProperty({ description: '알람 내역 ID', example: 1, default: -1, type: Number })
  @Expose({ name: 'alarmHistoryId' })
  @IsInt()
  alarm_history_id: number;

  @ApiProperty({ description: '유저 Seq ID', example: -1, default: -1, type: Number })
  @Expose({ name: 'userSeqId' })
  @IsInt()
  user_seq_id: number;
}