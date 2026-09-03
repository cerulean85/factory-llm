import { Expose } from 'class-transformer';
import { IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAlarmUserRelationDto {
  @ApiProperty({ description: '알람 ID', example: 1, default: -1, type: Number })
  @Expose({ name: 'alarmId' })
  @IsInt()
  alarm_id: number;

  @ApiProperty({ description: '사용자 Seq ID', example: 1, default: -1, type: Number })
  @Expose({ name: 'userSeqId' })
  @IsInt()
  user_seq_id: number;
}