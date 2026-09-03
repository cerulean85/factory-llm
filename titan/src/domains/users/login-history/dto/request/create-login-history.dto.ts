import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLoginHistoryDto {

  @ApiProperty({ description: '로그인 이력 유저 시퀀스 ID', example: '', default: '', type : Number })
  @Expose({ name: 'userSeqId' })
  user_seq_id: number;

  @ApiProperty({ description: '로그인 이력 IP', example: '', default: '', type : String })
  @Expose({ name: 'tryIp' })
  try_ip: string;
}