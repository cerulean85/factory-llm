import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Alarm } from 'src/domains/alarm/alarm/entities/alarm.entity';
import { ApiProperty } from '@nestjs/swagger';
import { AlarmHistory } from '../../../entities/alarm-history.entity';

@Index('idx_ea_alarm_history_id', ['alarm_history'])
@Entity('equipment_alarm_history')
export class EquipmentAlarmHistory {
  
  @ApiProperty({ description: '설비 알람 히스토리 ID', type: Number })
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ApiProperty({ description: '알람코드', default: -1, type: Alarm })
  @ManyToOne(() => Alarm, (alarm) => alarm.id)
  @JoinColumn({ name: 'alarm_id' })
  alarm: Alarm;

  @ApiProperty({ description: '알람 히스토리', default: -1, type: AlarmHistory })
  @ManyToOne(() => AlarmHistory, (alarmHistory) => alarmHistory.id)
  @JoinColumn({ name: 'alarm_history_id' })
  alarm_history: AlarmHistory;

  @ApiProperty({ description: '설비 이름', default: '', type: String })
  @Column({ type: 'varchar', length: 50 })
  equipment_name: string;

  @ApiProperty({ description: '설비 코드', default: '', type: String })
  @Column({ type: 'varchar', length: 50 })
  equipment_code: string;
}