import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class TempPasswordDto {
  @ApiProperty({ description: '사용자 아이디', default: '', type: String, example: '' })
  @IsString()
  userId: string;

  @ApiProperty({ description: '이메일', default: '', type: String, example: '' })
  @IsString()
  email: string;
}