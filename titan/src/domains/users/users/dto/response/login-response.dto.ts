import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';

export class LoginResponseDto {
  @ApiProperty({ description: '사용자 seq ID', default: -1, type: Number, example: 1 })
  @Expose()
  @Transform(({ value }) => value ? value : null)
  userSeqId: number = -1;

  @ApiProperty({ description: 'Access Token', default: '', type: String, example: '' })
  @Expose()
  @Transform(({ value }) => value ? value : null)
  accessToken: string = "";

  @ApiProperty({ description: 'Refresh Token', default: '', type: String, example: '' })
  @Expose()
  @Transform(({ value }) => value ? value : null)
  refreshToken: string = "";
}