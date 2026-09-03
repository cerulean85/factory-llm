import { IsInt, IsOptional, Min, Max } from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class CursorRequestDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Transform(({ value }) => (value ? Number(value) : 0))
  cursor : number = 0;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  @Transform(({ value }) => (value ? Number(value) : 10))
  limit : number = 10;
}