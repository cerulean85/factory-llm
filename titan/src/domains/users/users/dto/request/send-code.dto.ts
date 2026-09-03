import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class SendCodeDto {
  
  @ApiProperty({ description: '이메일', default: '', type: String })
  @IsString()
  email: string;

  @ApiProperty({ description: '인증코드', default: '', type: String })
  @IsString()
  code: string;
}