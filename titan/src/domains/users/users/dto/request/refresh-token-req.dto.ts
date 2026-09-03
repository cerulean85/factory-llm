import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RefreshTokenReqDto {
  @ApiProperty({ example: 'kv9ioawe4f23dkl~', description: 'refresh token 정보', default: '', type: String })
  @IsString()
  refreshToken: string = '';
}