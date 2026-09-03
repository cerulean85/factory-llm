import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

export class CommonUserInfoDto {
  @ApiProperty({ description: '사용자 ID', example: 1 })
  @Expose({ name: 'user_id' })
  id: string;

  @ApiProperty({ description: '사용자 SEQ ID', example: 1001 })
  @Expose({ name: 'seq_id' })
  seqId: number;

  @ApiProperty({ description: '이름', example: '홍길동' })
  @Expose()
  name: string;

  @ApiProperty({ description: '전화번호', example: '010-1234-5678' })
  @Expose({ name: 'phone_number' })
  phoneNumber: string;

  @ApiProperty({ description: '이메일', example: 'hong@example.com' })
  @Expose()
  email: string;
}