import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';

export class AccessTokenResponseDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI...', type: String })
  @Expose({ name: 'access_token' })
  @Transform(({ value }) => value ? value : null)
  accessToken: string;
}