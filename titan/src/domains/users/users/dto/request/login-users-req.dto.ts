import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class LoginReqDto {
  @ApiProperty({ description: '로그인 ID', example: 'loginID', default: '', type: String })
  @IsString()
  userId: string;

  @ApiProperty({ description: '비밀번호', example: 'passwd', default: '', type: String })
  @IsString()
  password: string;
}