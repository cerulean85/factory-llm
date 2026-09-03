import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Equipment } from 'src/domains/equipment/equipment/entities/equipment.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Alarm } from 'src/domains/alarm/alarm/entities/alarm.entity';

@Entity('alarm_queue')
export class AlarmQueue {
  @ApiProperty({ description: '알람뷰 ID', default: -1, type: Number })
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ApiProperty({ description: '알람코드 객체', default: -1, type: Alarm })
  @ManyToOne(() => Alarm, (alarm) => alarm.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'alarm_id' })
  alarm: Alarm;

  @ApiProperty({ description: '장비 객체', default: -1, type: Equipment })
  @ManyToOne(() => Equipment, (equipment) => equipment.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'equipment_id' })
  equipment: Equipment;

  @ApiProperty({ description: '생성일', default: new Date(), type: Date })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  create_date: Date;

  //0 : 완료, 1 : 발생
  @ApiProperty({ description: '완료상태', default: 1, type: Number })
  @Column({ type: 'int', default: 1 })
  process_status: number;

}