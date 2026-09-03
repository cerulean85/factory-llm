
import { Users } from 'src/domains/users/users/entities/users.entity';
import { Entity, PrimaryGeneratedColumn, JoinColumn, ManyToOne, Index } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { AlarmHistory } from '../../alarm-history/entities/alarm-history.entity';

@Index('idx_ahpbu_alarm_history_id', ['alarm_history'])
@Index('idx_ahpbu_user_seq_id', ['users'])
@Entity('alarm_history_process_by_user')
export class AlarmHistoryProcessByUser {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ApiProperty({ description: '유저 객체', default: null, type: Users })
  @ManyToOne(() => Users, (users) => users.seq_id, {onDelete: 'CASCADE'})
  @JoinColumn({ name: 'user_seq_id' })
  users: Users;

  @ApiProperty({ description: '알람 이력 객체', default: null, type: AlarmHistory })
  @ManyToOne(() => AlarmHistory, (alarmHistory) => alarmHistory.id, {onDelete: 'CASCADE'})
  @JoinColumn({ name: 'alarm_history_id' })
  alarm_history: AlarmHistory;
}