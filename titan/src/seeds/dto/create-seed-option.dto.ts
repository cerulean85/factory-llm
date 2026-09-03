import { Expose } from "class-transformer";
import { ApiProperty } from '@nestjs/swagger';

export class CreateSeedOptionDto {
  @ApiProperty({ description: '데이터 베이스 버전', default: 1.0, example: 1.0, type: Number })
  @Expose({ name: 'databaseVersion' })
  database_version: number = 1.0;
}