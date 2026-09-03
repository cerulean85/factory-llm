import { IsString, Length, IsOptional, IsDate, ValidateIf, IsInt, IsArray, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';
import { PaginationRequestDto } from 'src/common/dto/pagination-request.dto';
import { ApiProperty } from '@nestjs/swagger';

export class FilteringUsersDto extends PaginationRequestDto {
  @ApiProperty({ description: '검색 시작 날짜', example: '2024-01-01', default: '', type: String, required: false })
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

  @ApiProperty({ description: '검색 종료 날짜', example: '2024-12-31', default: '', type: String, required: false })
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

  @ApiProperty({ description: '필터링 키워드 : 이름|소속|전화번호|이메일', example: '연구소', default: '', type: String, required: false })
  @IsOptional()
  @Transform(({ value }) => (value && value.trim() !== '' ? String(value) : undefined))
  @ValidateIf((obj, value) => value !== undefined)
  @IsString()
  @Length(1, 100)
  keyword: string | undefined;

  @ApiProperty({ description: '사용자 Seq ID', example: 1, default: -1, type: Number, required: false })
  @IsOptional()
  @IsInt()
  seqId: number;

  @ApiProperty({ description: '사용자 Seq ID 리스트', example: [1, 2, 3], default: [], type: [Number], required: false })
  @IsOptional()
  @IsArray()
  seqIdList: number[];

  @ApiProperty({ description: '사용자 ID', example: 'test', default: '', type: String, required: false })
  @IsOptional()
  @IsString()
  userId: string;

  @ApiProperty({ description: '사용자 이메일', example: 'test@test.com', default: '', type: String, required: false })
  @IsOptional()
  @IsString()
  email: string;

  @ApiProperty({ description: '사용자 전화번호', example: '010-1234-5678', default: '', type: String, required: false })
  @IsOptional()
  @IsString()
  phoneNumber: string;

  @ApiProperty({ description: '사용자 탈퇴 여부', example: true, default: true, type: Boolean, required: false })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  validRecord: boolean = true;
}