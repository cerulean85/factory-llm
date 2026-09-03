import { IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class DeleteAlarmDto {
  @ApiProperty({ description: '알람 코드 리스트', example: "1,2", default: '', type: String })
  @IsString()
  @Type(() => String)
  alarmIdList: string = '';
}