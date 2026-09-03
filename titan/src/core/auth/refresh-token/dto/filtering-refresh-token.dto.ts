import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class FilteringRefreshTokenDto {
  @ApiProperty({ description: '사용자 Seq ID', default: -1, type: Number, required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  userSeqId: number;

  @ApiProperty({ description: 'refresh token', default: '', type: String, required: false })
  @IsOptional()
  @Type(() => String)
  @IsString()
  refreshToken: string;
}