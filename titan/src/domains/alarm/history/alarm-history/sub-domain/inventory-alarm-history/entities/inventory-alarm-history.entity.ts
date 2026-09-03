import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { AlarmHistory } from '../../../entities/alarm-history.entity';
import { ALERT_TYPE, INVENTORY_ALARM_TYPE } from 'src/common/enum/alarm.enum';
import { WAREHOUSE_TYPE } from 'src/common/enum/equipment.enum';

@Index('idx_ia_alarm_history_id', ['alarm_history'])
@Entity('inventory_alarm_history')
export class InventoryAlarmHistory {
  
  @ApiProperty({ description: '재고 알람 히스토리 ID', type: Number })
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ApiProperty({ description: '알람 히스토리', default: -1, type: AlarmHistory })
  @ManyToOne(() => AlarmHistory, (alarmHistory) => alarmHistory.id)
  @JoinColumn({ name: 'alarm_history_id' })
  alarm_history: AlarmHistory;

  @ApiProperty({ description: '타이어 타입', default: '', type: String })
  @Column({ type: 'varchar', length: 100 })
  standard_type: string = '';

  @ApiProperty({ description: '재고 개수', default: 0, type: Number })
  @Column({ type: 'int'})
  stored_item_count: number = 0;

  @ApiProperty({ description: '설비 알람 타입', default: INVENTORY_ALARM_TYPE.STORED, enum: INVENTORY_ALARM_TYPE })
  @Column({ enum: INVENTORY_ALARM_TYPE})
  inventory_alarm_type: INVENTORY_ALARM_TYPE = INVENTORY_ALARM_TYPE.STORED;

  @ApiProperty({ description: '설비 알람 타입', default: ALERT_TYPE.WARNING, enum: ALERT_TYPE })
  @Column({ enum: ALERT_TYPE })
  alert_type: ALERT_TYPE = ALERT_TYPE.WARNING;

  @ApiProperty({ description: '창고 이름', default: '', type: String })
  @Column({ type: 'varchar', length: 50 })
  warehouse_name: string = '';

  @ApiProperty({ description: '창고 코드', default: '', type: String })
  @Column({ type: 'varchar', length: 50 })
  warehouse_code: string = '';

  @ApiProperty({ description: '창고 유형', default: WAREHOUSE_TYPE.ETC, enum: WAREHOUSE_TYPE })
  @Column({ enum: WAREHOUSE_TYPE })
  warehouse_type: WAREHOUSE_TYPE = WAREHOUSE_TYPE.ETC;
}