import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('setting_system')
export class System {
  @ApiProperty({ description: '시스템 ID', default: -1, type: Number })
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ApiProperty({ description: '시스템 생성 날짜', default: '', type: Date })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  create_date: Date;

  @ApiProperty({ description: '시스템 수정 날짜', default: '', type: Date })
  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  update_date: Date;

  @ApiProperty({ description: '알람 전송 여부', default: true, type: Boolean })
  @Column({ type: 'boolean', default: true })
  alarm_send_enabled: boolean;

  @ApiProperty({
    description: '설비 알람 전송 여부',
    default: true,
    type: Boolean,
  })
  @Column({ type: 'boolean', default: true })
  equipment_alarm_enabled: boolean;

  @ApiProperty({
    description: '재고 알람 전송 여부',
    default: true,
    type: Boolean,
  })
  @Column({ type: 'boolean', default: true })
  inventory_alarm_enabled: boolean;

  @ApiProperty({
    description: '장기 재고 남은 일수',
    default: -1,
    type: Number,
  })
  @Column({ type: 'int', default: -1 })
  inventory_alarm_remaining_day: number;

  @ApiProperty({ description: 'Crane 경고 비율', default: -1, type: Number })
  @Column({ type: 'int', default: -1 })
  load_warning_ratio_crane: number;

  @ApiProperty({ description: 'Crane 위험 비율', default: -1, type: Number })
  @Column({ type: 'int', default: -1 })
  load_danger_ratio_crane: number;

  @ApiProperty({ description: 'Crane 경고 색상', default: '', type: String })
  @Column({ type: 'varchar', default: '' })
  load_warning_color_crane: string;

  @ApiProperty({ description: 'Crane 위험 색상', default: '', type: String })
  @Column({ type: 'varchar', default: '' })
  load_danger_color_crane: string;

  @ApiProperty({ description: 'Gantry 경고 비율', default: -1, type: Number })
  @Column({ type: 'int', default: -1 })
  load_warning_ratio_gantry: number;

  @ApiProperty({ description: 'Gantry 위험 비율', default: -1, type: Number })
  @Column({ type: 'int', default: -1 })
  load_danger_ratio_gantry: number;

  @ApiProperty({ description: 'Gantry 경고 색상', default: '', type: String })
  @Column({ type: 'varchar', default: '' })
  load_warning_color_gantry: string;

  @ApiProperty({ description: 'Gantry 위험 색상', default: '', type: String })
  @Column({ type: 'varchar', default: '' })
  load_danger_color_gantry: string;

  @ApiProperty({
    description: '웹 브라우저 새로고침 강제',
    default: false,
    type: Boolean,
  })
  @Column({ type: 'boolean', default: false })
  refresh_browser: boolean;
}
