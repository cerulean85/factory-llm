import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { AlarmHistory } from '../../../entities/alarm-history.entity';

@Index('idx_pa_alarm_history_id', ['alarm_history'])
@Entity('pallet_alarm_history')
export class PalletAlarmHistory {
  
  @ApiProperty({ description: '재고 알람 히스토리 ID', type: Number })
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ApiProperty({ description: '알람 히스토리', default: -1, type: AlarmHistory })
  @ManyToOne(() => AlarmHistory, (alarmHistory) => alarmHistory.id)
  @JoinColumn({ name: 'alarm_history_id' })
  alarm_history: AlarmHistory;

  @ApiProperty({ description: '재고 개수', default: 0, type: Number })
  @Column({ type: 'int'})
  warning_count: number = 0;
}