import { IsString, Length, IsOptional, IsDate, ValidateIf, IsBoolean } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { CursorRequestDto } from 'src/common/dto/cursor-request.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CursorFilteringUsersDto extends CursorRequestDto {
  @ApiProperty({ description: '사용자 조회 키워드', default: '', type: String, required: false })
  @IsOptional()
  @Transform(({ value }) => (value && value.trim() !== '' ? String(value) : undefined))
  @ValidateIf((obj, value) => value !== undefined)
  @IsString()
  @Length(1, 100)
  keyword: string | undefined;

  @ApiProperty({ description: '사용자 탈퇴 여부', example: true, default: true, type: Boolean, required: false })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  validRecord: boolean;
}