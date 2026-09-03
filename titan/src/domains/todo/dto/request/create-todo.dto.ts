import { Expose, Transform, Type } from 'class-transformer';
import { IsString, Length, IsOptional, IsInt, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { DateTransform } from 'src/common/decorator/date-transform.decorator';

export class CreateTodoDto {
  @ApiProperty({ name: 'targetStartDate', description: '목표 날짜', example: new Date(), default: new Date(), type: Date, required: true })
  @Expose({name: 'targetStartDate'})
  @DateTransform()
  target_start_date: Date;

  @ApiProperty({ name: 'targetEndDate', description: '목표 날짜', example: new Date(), default: new Date(), type: Date, required: true })
  @Expose({name: 'targetEndDate'})
  @DateTransform()
  target_end_date: Date;

  @ApiProperty({ name: 'targetCount', description: '목표량', example: 100, default: -1, type: Number})
  @Expose({ name: 'targetCount' })
  @Type(() => Number)
  target_count: number = -1;

  @ApiProperty({ name: 'standardType', description: '타이어 규격', example: '1d-356-86', default: '', type: String })
  @Expose({ name: 'standardType' })
  @Type(() => String)
  @Length(1, 100)
  @IsString()
  standard_type: string;

  @ApiProperty({ description: '내용', default: '', example: '컨텐츠..', type: String })
  @Expose()
  @IsString()
  @IsOptional()
  description: string = '';

  @ApiProperty({ name: 'alarmOffsetHours', description: '알람 발생 시간', default: 1, example: 1, type: Number })
  @Expose({ name: 'alarmOffsetHours' })
  @IsInt()
  @IsOptional()
  alarm_offset_hours: number = 1;

  @ApiProperty({ name: 'alarmProcessFlag', description: '알람 전송 여부', default: false, example: false, type: Boolean })
  @Expose({ name: 'alarmProcessFlag' })
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  @IsOptional()
  alarm_process_flag: boolean = false;
  
  @ApiProperty({ name: 'usersSeqId', description: '작성자 Seq ID', default: 1, example: 1, type: Number })
  @Expose({ name: 'usersSeqId' })
  @IsOptional()
  @IsInt()
  users_seq_id: number;
}