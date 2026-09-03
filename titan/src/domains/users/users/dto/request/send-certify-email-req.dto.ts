import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class SendCertifyEmailReqDto {
  
  @ApiProperty({ example: 'example@test.com', description: '이메일', default: '', type: String })
  @IsString()
  email: string = '';
}