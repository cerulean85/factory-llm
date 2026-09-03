import { Expose, Type } from 'class-transformer';
import { IsArray, IsInt, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignUsersToAlarmHistoryDto {
  @ApiProperty({ description: '알람 내역 ID', example: 1, default: -1, type: Number })
  @IsInt()
  alarmHistoryId: number;

  @ApiProperty({ description: '유저 Seq ID List', example: [1, 2, 3], type: [Number] })
  @IsArray()
  @Type(() => Number)
  @IsOptional()
  @IsInt({ each: true })
  userSeqIdList: number[] | undefined;
}