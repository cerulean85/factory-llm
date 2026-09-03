import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, IsOptional } from "class-validator";

export class FilteringRemoteDto {
  @ApiProperty({ description: '원격 ID', default: -1, type: Number, required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  remoteId: number;

  @ApiProperty({ description: '사용자 Seq ID', default: -1, type: Number, required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  userSeqId: number;
}