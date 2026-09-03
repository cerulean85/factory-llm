import { Expose, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UsersResponseDto {
  @ApiProperty({ description: '사용자 seq ID', default: -1, type: Number, example: 1 })
  @Expose({ name: 'seq_id' })
  @Transform(({ value }) => value ?? null)
  userSeqId: number = -1;

  @ApiProperty({ description: '사용자 아이디', default: '', type: String, example: 'user_id' })
  @Expose({ name: 'user_id' })
  @Transform(({ value }) => value ?? null)
  userId: string = "";

  @ApiProperty({ description: '사용자 이름', default: '', type: String, example: 'John Doe' })
  @Expose()
  @Transform(({ value }) => value ?? null)
  name: string = "";

  @ApiProperty({ description: '전화번호', default: '', type: String, example: '010-1234-1234' })
  @Expose({ name: 'phone_number' })
  @Transform(({ value }) => value ?? null)
  phoneNumber: string = "";

  @ApiProperty({ description: '생성날짜', default: '', type: Date, example: '2023-01-01 00:00:00' })
  @Expose({ name: 'create_date' })
  @Transform(({ value }) => value ?? null)
  createDate: Date = new Date();

  @ApiProperty({ description: '업데이트 날짜', default: '', type: Date, example: '2023-01-01 00:00:00' })
  @Expose({ name: 'update_date' })
  @Transform(({ value }) => value ?? null)
  updateDate: Date = new Date();

  @ApiProperty({ description: '소속', default: '', type: String, example: '개발팀' })
  @Expose()
  @Transform(({ value }) => value ?? null)
  affiliation: string = "";

  @ApiProperty({ description: '이메일', default: '', type: String, example: 'example@test.com' })
  @Expose()
  @Transform(({ value }) => value ?? null)
  email: string = "";
}