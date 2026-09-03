import { Expose, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class TodoResponseDto {
  @ApiProperty({ description: 'ID', default: -1, type: Number })
  @Expose({ name: 'id' })
  todoId: number = -1;

  @ApiProperty({ description: '목표량', example: 100, default: -1, type: Number})
  @Expose({ name: 'target_count' })
  targetCount: number = -1;

  @ApiProperty({ description: '내용', default: '', type: String })
  @Expose()
  description: string = '';

  @ApiProperty({ description: '타이어 규격', default: '', type: String })
  @Expose({name: 'standard_type'})
  standardType: string = '';

  @ApiProperty({ description: '목표 날짜', default: new Date(), type: Date })
  @Expose({ name: 'target_date' })
  targetDate: Date = new Date();

  @ApiProperty({ description: '작성 날짜', default: new Date(), type: Date })
  @Expose({ name: 'create_date' })
  createDate: Date = new Date();

  @ApiProperty({ description: '수정 날짜', default: new Date(), type: Date })
  @Expose({ name: 'update_date' })
  updateDate: Date = new Date();

  @ApiProperty({ description: '알람 발생 시간', default: -1, type: Number })
  @Expose({ name: 'alarm_offset_hours' })
  alarmOffsetHours: number = -1;

  @ApiProperty({ description: '작성자 ID', default: '', type: String })
  @Expose({ name: 'users.id' })
  @Transform(({ obj }) => obj.users?.user_id ?? '')
  usersId: string = '';

  @ApiProperty({ description: '작성자 Seq ID', default: -1, type: Number })  
  @Expose({ name: 'users.seq_id' })
  @Transform(({ obj }) => obj.users?.seq_id ?? -1)
  usersSeqId: number = -1;

  @ApiProperty({ description: '작성자 이름', default: '', type: String })
  @Expose({ name: 'users.name' })
  @Transform(({ obj }) => obj.users?.name ?? '')
  userName: string = '';
  
  @ApiProperty({ description: '목표 시작일', default:  new Date(), type: Date })
  @Expose({ name: 'target_start_date' })
  targetStartDate: Date;

  @ApiProperty({ description: '목표 종료일', default:  new Date(), type: Date })
  @Expose({ name: 'target_end_date' })
  targetEndDate: Date;

  @ApiProperty({ description: '알람 전송 여부', default: false, type: Boolean })
  @Expose({ name: 'alarm_process_flag' })
  alarmProcessFlag: boolean;
}