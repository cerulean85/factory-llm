import { Type, Expose, Transform } from 'class-transformer';
import { IsDate, IsOptional, IsInt, IsArray, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { DateTransform } from 'src/common/decorator/date-transform.decorator';

export class UpdateProcessAlarmHistoryDto {
  @ApiProperty({ name: 'processDate', description: '조치일자', default: new Date(), type: Date })
  @Expose({ name: 'processDate' })
  @IsOptional()
  @DateTransform()
  @Transform(({ value }) => value ? new Date(value) : new Date())
  process_date: Date = new Date();

  @ApiProperty({ description: '조치내역', default: '', type: String })
  @Expose({ name: 'processMessage' })
  @IsOptional()
  @IsString()
  process_message: string = '';

  @ApiProperty({ name: 'userSeqIdList', description: '담당자 번호 목록', default: [], type: Number, isArray: true })
  @Expose({ name: 'userSeqIdList' })
  @IsOptional()
  @IsArray()         
  @Type(() => Number) 
  @IsInt({ each: true }) 
  user_seq_id_list: number[] | undefined = undefined;
  
}