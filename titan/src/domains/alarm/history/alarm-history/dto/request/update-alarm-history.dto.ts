import { Type, Expose } from 'class-transformer';
import { IsDate, IsOptional, IsInt, IsArray, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateAlarmHistoryDto {
  @ApiProperty({ name: 'processDate', description: '조치일자', default: new Date(), type: Date })
  @Expose({ name: 'processDate' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
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
  @IsInt({ each: true }) 
  user_seq_id_list: number[] = [];
  
}