import { Alarm } from 'src/domains/alarm/alarm/entities/alarm.entity';
import { Users } from 'src/domains/users/users/entities/users.entity';
import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne, Index } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Index('idx_alarm_user_relation_alarm_id', ['alarm'])
@Index('idx_alarm_user_relation_user_seq_id', ['users'])
@Entity('alarm_user_relation')
export class AlarmUserRelation {
  @ApiProperty({ description: '알람 유저 관계 ID', default: -1, type: Number })
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ApiProperty({ description: '유저 객체', default: null, type: Users })
  @ManyToOne(() => Users, (users) => users.seq_id, {onDelete: 'CASCADE'})
  @JoinColumn({ name: 'user_seq_id' })
  users: Users;

  @ApiProperty({ description: '알람 객체', default: null, type: Alarm })
  @ManyToOne(() => Alarm, (alarm) => alarm.id, {onDelete: 'CASCADE'})
  @JoinColumn({ name: 'alarm_id' })
  alarm: Alarm;
}