import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class FindUserIdReqDto {
  @ApiProperty({ example: 'example@test.com', description: '이메일 또는 휴대폰 번호', default: '', type: String })
  @IsString()
  emailOrPhoneNumber: string = '';
}