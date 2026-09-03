import { IsString, IsOptional, Length, IsEnum } from 'class-validator';
import { ROLE_TYPE } from 'src/common/enum/users.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRoleDto {
  @ApiProperty({ description: '권한 유형', default: ROLE_TYPE.DEFAULT, enum: ROLE_TYPE })
  @IsEnum(ROLE_TYPE)
  @Length(1, 20)
  type: ROLE_TYPE = ROLE_TYPE.DEFAULT;

  @ApiProperty({ description: '상세 내역', default: '', type: String })
  @IsOptional()
  @IsString()
  @Length(0, 500)
  description: string = '';
}