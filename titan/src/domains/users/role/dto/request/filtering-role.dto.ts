import { IsString, IsOptional, IsEnum, IsNumber, IsBoolean } from 'class-validator';
import { ROLE_TYPE } from 'src/common/enum/users.enum';
import { ApiProperty } from '@nestjs/swagger';
import { PaginationRequestDto } from 'src/common/dto/pagination-request.dto';
import { Transform } from 'class-transformer';

export class FilteringRoleDto extends PaginationRequestDto {
  @ApiProperty({ description: '권한 ID', default: -1, type: Number })
  @IsOptional()
  @IsNumber()
  id: number;

  @ApiProperty({ description: '권한 유형', default: ROLE_TYPE.DEFAULT, enum: ROLE_TYPE })
  @IsOptional()
  @IsEnum(ROLE_TYPE)
  type: ROLE_TYPE = ROLE_TYPE.DEFAULT;

  @ApiProperty({ description: '사용자 ID', default: -1, type: Number })
  @IsOptional()
  @IsNumber()
  userSeqId: number;

  @ApiProperty({ description: '사용 여부', default: true, type: Boolean })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  validRecord: boolean;
}