import { Expose, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class NotiResponseDto {
  @ApiProperty({ description: '공지사항 ID', default: -1, type: Number })
  @Expose({ name: 'id' })
  notiId: number = -1;

  @ApiProperty({ description: '공지사항 제목', default: '', type: String })
  @Expose()
  title: string = '';

  @ApiProperty({ description: '공지사항 내용', default: '', type: String })
  @Expose()
  content: string = '';

  @ApiProperty({ description: '공지사항 작성 날짜', default: '', type: Date })
  @Expose({ name: 'create_date' })
  createDate: Date = new Date();

  @ApiProperty({ description: '공지사항 수정 날짜', default: '', type: Date })
  @Expose({ name: 'update_date' })
  updateDate: Date = new Date();;

  @ApiProperty({ description: '공지사항 작성자 ID', default: '', type: String })
  @Expose({ name: 'users.id' })
  @Transform(({ obj }) => obj.users?.user_id ?? '')
  usersId: string = '';

  @ApiProperty({ description: '공지사항 작성자 Seq ID', default: -1, type: Number })  
  @Expose({ name: 'users.seq_id' })
  @Transform(({ obj }) => obj.users?.seq_id ?? -1)
  usersSeqId: number = -1;

  @ApiProperty({ description: '공지사항 작성자 이름', default: '', type: String })
  @Expose({ name: 'users.name' })
  @Transform(({ obj }) => obj.users?.name ?? '')
  userName: string = '';
}