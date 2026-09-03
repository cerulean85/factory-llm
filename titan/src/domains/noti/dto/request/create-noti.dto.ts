import { Transform, Expose } from 'class-transformer';
import { IsString, Length, IsOptional, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateNotiDto {
  @ApiProperty({ description: '공지사항 제목', default: '', example: '', type: String })
  @Expose()
  @IsString()
  @Length(1, 100)
  title: string;

  @ApiProperty({ description: '공지사항 내용', default: '', example: '', type: String })
  @Expose()
  @IsString()
  content: string;
  
  @ApiProperty({ name: 'usersSeqId', description: '공지사항 작성자 Seq ID', default: 0, example: 0, type: Number })
  @Expose({ name: 'usersSeqId' })
  @IsOptional()
  @IsInt()
  users_seq_id: number;
}