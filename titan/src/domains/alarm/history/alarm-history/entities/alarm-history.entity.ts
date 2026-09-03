import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Index, OneToOne } from 'typeorm';
import { Alarm } from 'src/domains/alarm/alarm/entities/alarm.entity';
import { ApiProperty } from '@nestjs/swagger';
import { ALARM_HISTORY_TYPE } from 'src/common/enum/alarm.enum';
import { Users } from 'src/domains/users/users/entities/users.entity';
import { EquipmentAlarmHistory } from '../sub-domain/equipment-alarm-history/entities/equipment-alarm-history.entity';
import { InventoryAlarmHistory } from '../sub-domain/inventory-alarm-history/entities/inventory-alarm-history.entity';
import { PalletAlarmHistory } from '../sub-domain/pallet-alarm-history/entities/pallet-alarm-history.entity';

@Index('idx_alarm_type_date', ['type', 'create_date'])
@Entity('alarm_history')
export class AlarmHistory {
  
  @ApiProperty({ description: '알람 ID', type: Number })
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ApiProperty({ description: '생성일', default: new Date(), type: Date })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  create_date: Date;

  @ApiProperty({ description: '수정일', default: new Date(), type: Date })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  update_date: Date;

  @ApiProperty({ description: '조치일', default: null, type: Date })
  @Column({ type: 'timestamp',  nullable: true })
  process_date: Date | null = null;

  @ApiProperty({ description: '메시지', default: '', type: String })
  @Column({ type: 'varchar', length: 500, nullable: true })
  message: string | null = '';

  @ApiProperty({ description: '조치내역', default: '', type: String })
  @Column({ type: 'varchar', length: 300, default: ''})
  process_message: string = '';

  @ApiProperty({ description: '알람 히스토리 타입', default: ALARM_HISTORY_TYPE.EQUIPMENT, type: String })
  @Column({ type: 'varchar', length: 10,  default: ALARM_HISTORY_TYPE.EQUIPMENT})
  type: ALARM_HISTORY_TYPE = ALARM_HISTORY_TYPE.EQUIPMENT;
  
  process_user_list?: Users[];

  @OneToOne(() => EquipmentAlarmHistory, (ea) => ea.alarm_history, { nullable: true })
  equipment_alarm_history?: EquipmentAlarmHistory | null;

  @OneToOne(() => InventoryAlarmHistory, (ia) => ia.alarm_history, { nullable: true })
  inventory_alarm_history?: InventoryAlarmHistory | null;

  @OneToOne(() => PalletAlarmHistory, (pa) => pa.alarm_history, { nullable: true })
  pallet_alarm_history?: PalletAlarmHistory | null;
}