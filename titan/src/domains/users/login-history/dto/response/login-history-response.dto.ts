import { Expose, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class LoginHistoryResponseDto {
  @ApiProperty({ description: '로그인 이력 ID', default: -1, type: Number })
  @Expose({ name: 'id' })
  loginHistoryId: number = -1;

  @ApiProperty({ description: '로그인 IP', default: '', type: String })
  @Expose({ name: 'try_ip'})
  tryIp: string = "";

  @ApiProperty({ description: '사용자 Seq ID', default: -1, type: Number })
  @Expose({ name: 'user_seq_id' })
  @Transform(({ obj }) => obj.users?.seq_id)
  userSeqId: number = -1;
 
  @ApiProperty({ description: '사용자 ID', default: '', type: String })
  @Expose({ name: 'userId' })
  @Transform(({ obj }) => obj.users?.user_id)
  userId: string = "";

  @ApiProperty({ description: '사용자 이름', default: '', type: String })
  @Expose({ name: 'userName' })
  @Transform(({ obj }) => obj.users?.name)
  userName: string = "";

  @ApiProperty({ description: '로그인 날짜', default: '', type: Date })
  @Expose({ name: 'create_date' })
  createDate: Date = new Date();
}