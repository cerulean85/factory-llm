import { IsInt, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaginationRequestDto } from 'src/common/dto/pagination-request.dto';

export class FilteringAlarmHistoryProcessByUserDto extends PaginationRequestDto {
  @ApiProperty({ description: '알람 내역 ID', example: 1, default: -1, type: Number })
  @IsOptional()
  @IsInt()
  alarmHistoryId: number;

  @ApiProperty({ description: '유저 Seq ID', example: -1, default: -1, type: Number })
  @IsOptional()
  @IsInt()
  userSeqId: number;
}