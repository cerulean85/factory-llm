import { IsString, IsBoolean, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResponseStatusDto {
  @ApiProperty({ description: '성공여부' })
  @IsBoolean()
  isSuccess: boolean = false;

  @ApiProperty({ example: 'message', description: '상태 메시지' })
  @IsString()
  message: string = '';
}