import { Expose } from "class-transformer";
import { IsNumber, IsString, Length } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateRemoteDto {

  @ApiProperty({ description: '위치', example: 'test' })
  @Expose()
  @IsString()
  @Length(1, 50)
  location: string;

  @ApiProperty({ description: 'IP', example: '000.000.000.000' })
  @Expose()
  @IsString()
  @Length(1, 20)
  ip: string;

  @ApiProperty({ description: '포트', example: 8080 })
  @Expose()
  @IsNumber()
  port: number;

  @ApiProperty({ description: '사용자 Seq ID', example: 1 })
  @Expose({ name: 'seqId' })
  @IsNumber()
  seq_id: number;
}