import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';

export class FindedUserIdResponseDto {
  @ApiProperty({ description: '사용자 Login ID', default: "", type: String, example: "userId" })
  @Expose({ name: 'user_id' })
  @Transform(({ value }) => value ? value : null)
  userId: string = "";
}