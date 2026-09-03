import { Transform, Expose, Type } from 'class-transformer';
import { IsString, Length, IsOptional, IsInt, IsBoolean, IsDate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateShippingSpecificationDto {
  @ApiProperty({ description: '중점 출고 규격', default: '', example: '', type: String })
  @Expose({ name: 'standardType' })
  @IsString()
  @Length(0, 100)
  standard_type: string = '';

  @ApiProperty({ description: '사용자 Seq ID', default: -1, example: -1, type: Number })
  @Expose({ name: 'usersSeqId' })
  @IsOptional()
  @IsInt()
  users_seq_id: number;
}