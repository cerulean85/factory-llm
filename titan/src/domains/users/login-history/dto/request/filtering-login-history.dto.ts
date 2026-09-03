import { IsString, Length, IsOptional, IsDate, ValidateIf, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';
import { PaginationRequestDto } from 'src/common/dto/pagination-request.dto';
import { ApiProperty } from '@nestjs/swagger';

export class FilteringLoginHistoryDto extends PaginationRequestDto {
  @ApiProperty({ description: 'LoginHistory ID', default: -1, type: Number })
  @IsOptional()
  @IsNumber()
  loginHistoryId: number | undefined;

  @ApiProperty({ description: 'User ID', default: -1, type: Number })
  @IsOptional()
  @IsNumber()
  userSeqId: number | undefined;

  @ApiProperty({ description: '조회 시작 날짜', default: '', type: Date })
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

  @ApiProperty({ description: '조회 종료 날짜', default: '', type: Date })
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

  @ApiProperty({ description: '조회 키워드', default: '', type: String })
  @IsOptional()
  @Transform(({ value }) => (value && value.trim() !== '' ? String(value) : undefined))
  @ValidateIf((obj, value) => value !== undefined)
  @IsString()
  @Length(1, 100)
  keyword: string | null;
}