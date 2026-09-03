import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Users } from 'src/domains/users/users/entities/users.entity';
import { ApiProperty } from '@nestjs/swagger';
import { AlarmHistory } from 'src/domains/alarm/history/alarm-history/entities/alarm-history.entity';
import { SEND_MESSAGE_TYPE } from 'src/common/enum/alarm.enum';
@Entity('message_dispatch_history')
export class MessageDispatchHistory {
  @ApiProperty({ description: 'ID', type: Number })
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ApiProperty({ description: '전송 종류', example: SEND_MESSAGE_TYPE.SMS, default: SEND_MESSAGE_TYPE.SMS, enum: SEND_MESSAGE_TYPE })
  @Column({ type: 'varchar', length: 20, default: SEND_MESSAGE_TYPE.SMS })
  type: SEND_MESSAGE_TYPE;

  @ApiProperty({ description: '전송 내용', example: '내용 전송', default: '', type: String })
  @Column({ type: 'varchar', length: 500, default: ''})
  message: string = '';
  
  @ApiProperty({ description: '전송 성공 여부', example: true, default: true, type: Boolean })
  @Column({ type: 'boolean', default: true })
  dispatch_success: boolean;

  @ApiProperty({ description: '생성 날짜', default:  new Date(), type: Date })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  create_date: Date;

  @ApiProperty({ description: '알람 내용 (히스토리 객체)', type: AlarmHistory })
  @ManyToOne(() => AlarmHistory, (alarmHistory) => alarmHistory.id)
  @JoinColumn({ name: 'alarm_history_id' })
  alarm_history: AlarmHistory;
  
  @ApiProperty({ description: '작성자 (사용자 객체)', type: Users })
  @ManyToOne(() => Users, (users) => users.seq_id)
  @JoinColumn({ name: 'users_seq_id' })
  users: Users;
  

}