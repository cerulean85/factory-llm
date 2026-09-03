import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Alarm } from 'src/domains/alarm/alarm/entities/alarm.entity';
import { ApiProperty } from '@nestjs/swagger';
import { AlarmHistory } from '../../../alarm/history/alarm-history/entities/alarm-history.entity';
import { Users } from 'src/domains/users/users/entities/users.entity';
import { Warehouse } from 'src/domains/storage/warehouse/entities/warehouse.entity';

@Index('idx_lti_alarm_history_id', ['alarm_history'])
@Entity('long_term_item_alarm_history')
export class LongTermItemAlarmHistory {
  
  @ApiProperty({ description: '장기 재고 알람 히스토리 ID', type: Number })
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ApiProperty({ description: '알람 히스토리', default: -1, type: AlarmHistory })
  @ManyToOne(() => AlarmHistory, (alarmHistory) => alarmHistory.id)
  @JoinColumn({ name: 'alarm_history_id' })
  alarm_history: AlarmHistory;

  @ApiProperty({ description: '창고 정보', default: -1, type: Warehouse })
  @ManyToOne(() => Warehouse, (warehouse) => warehouse.id)
  @JoinColumn({ name: 'warehouse_id' })
  warehouse: Warehouse;

  @ApiProperty({ description: '타이어 타입', default: '', type: String })
  @Column({ type: 'varchar', length: 100 })
  standard_type: string = '';

  @ApiProperty({ description: '재고 개수', default: 0, type: Number })
  @Column({ type: 'int'})
  long_term_item_count: number = 0;
}