import { IsInt, IsOptional, Min, Max } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class PaginationRequestDto {
  @ApiProperty({ description: '페이지번호', default: 1, type: 'number'})
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Transform(({ value }) => (value ? Number(value) : 1))
  page : number = 1;

  @ApiProperty({ description: '페이지 당 항목 개수', default: 10, type: 'number'})
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  @Transform(({ value }) => (value ? Number(value) : 10))
  limit : number = 10;
} 