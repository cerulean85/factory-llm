import { Expose, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class MessageDispatchHistoryResponseDto {
  @ApiProperty({ description: 'ID', default: -1, type: Number })
  @Expose({ name: 'id' })
  messageDispatchHistoryId: number = -1;

  @ApiProperty({ description: '전송 타입', default: '', type: String })
  @Expose()
  type: string = '';

  @ApiProperty({ description: '전송 내용', default: '', type: String })
  @Expose()
  message: string = '';

  @ApiProperty({ description: '전송 성공 여부', default: true, type: Boolean })
  @Expose({ name: 'dispatch_success' })
  dispatchSuccess: boolean = true;

  @ApiProperty({ description: '생성(전송) 날짜', default: new Date(), type: Date })
  @Expose({ name: 'create_date' })
  createDate: Date = new Date();

  @ApiProperty({ description: '전송된 유저 ID', default: '', type: String })
  @Expose({ name: 'users.id' })
  @Transform(({ obj }) => obj.users?.user_id ?? '')
  usersId: string = '';

  @ApiProperty({ description: '전송된 유저 Seq ID', default: -1, type: Number })  
  @Expose({ name: 'users.seq_id' })
  @Transform(({ obj }) => obj.users?.seq_id ?? -1)
  usersSeqId: number = -1;

  @ApiProperty({ description: '작성자 이름', default: '', type: String })
  @Expose({ name: 'users.name' })
  @Transform(({ obj }) => obj.users?.name ?? '')
  userName: string = '';
}