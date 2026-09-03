import { IsInt, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaginationRequestDto } from 'src/common/dto/pagination-request.dto';

export class FilteringAlarmUserRelationDto extends PaginationRequestDto {
  @ApiProperty({ description: '알람 유저 관계 ID', example: 1, default: -1, type: Number })
  @IsOptional()
  @IsInt()
  id: number;

  @ApiProperty({ description: '알람 ID', example: 1, default: -1, type: Number })
  @IsOptional()
  @IsInt()
  alarmId: number;

  @ApiProperty({ description: '사용자 Seq ID', example: 1, default: -1, type: Number })
  @IsOptional()
  @IsInt()
  userSeqId: number;
}