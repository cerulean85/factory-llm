import { Transform } from 'class-transformer';
import { IsString, Length, IsOptional, IsInt, IsDate, ValidateIf } from 'class-validator';
import { PaginationRequestDto } from 'src/common/dto/pagination-request.dto';
import { ApiProperty } from '@nestjs/swagger';

export class FilteringNotiDto extends PaginationRequestDto {
  @ApiProperty({ description: '조회 시작 날짜', default: '', example: '', type: Date, required: false })
  @IsOptional()
  @Transform(({ value }) => {
    // value가 string이나 공백이 아니면 Date로 변환
    if (typeof value === 'string' && value.trim() !== '') {
      return new Date(value);
    } else if (value instanceof Date) {
      return value; // value가 Date 객체면 그대로 반환
    } else {
      return undefined;  // 이외 전부 undefined 반환
    }
  }, { toClassOnly: true })
  @ValidateIf((obj, value) => value !== undefined)
  @IsDate()
  startDate: Date | undefined;

  @ApiProperty({ description: '조회 종료 날짜', default: '', example: '', type: Date, required: false })
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string' && value.trim() !== '') {
      return new Date(value);
    } else if (value instanceof Date) {
      return value;
    } else {
      return undefined;
    }
  }, { toClassOnly: true })
  @ValidateIf((obj, value) => value !== undefined)
  @IsDate()
  endDate: Date | undefined;

  @ApiProperty({ description: '조회 키워드', default: '', example: '', type: String, required: false })
  @IsOptional()
  @Transform(({ value }) => (value ? String(value) : undefined))
  @ValidateIf((obj, value) => value !== undefined)
  @IsString()
  @Length(1, 100)
  keyword: string | undefined;

  @ApiProperty({ description: '공지 ID', default: -1, example: -1, type: Number, required: false })
  @IsOptional()
  @Transform(({ value }) => (value ? Number(value) : undefined))
  @ValidateIf((obj, value) => value !== undefined)
  @IsInt()
  notiId: number | undefined;
}