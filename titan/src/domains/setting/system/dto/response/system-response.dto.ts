import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class SystemResponseDto {
  @ApiProperty({ description: '시스템 ID', default: -1, type: Number })
  @Expose()
  id: number = -1;

  @ApiProperty({ description: '시스템 생성 날짜', default: '', type: Date })
  @Expose({ name: 'create_date' })
  createDate: Date = new Date();

  @ApiProperty({ description: '시스템 수정 날짜', default: '', type: Date })
  @Expose({ name: 'update_date' })
  updateDate: Date = new Date();

  @ApiProperty({ description: '알람 전송 여부', default: true, type: Boolean})
  @Expose({ name: 'alarm_send_enabled' })
  alarmSendEnabled: boolean = true;

  @ApiProperty({ description: '설비 알람 전송 여부', default: true, type: Boolean })
  @Expose({ name: 'equipment_alarm_enabled' })
  equipmentAlarmEnabled: boolean = true;

  @ApiProperty({ description: '재고 알람 전송 여부', default: true, type: Boolean })
  @Expose({ name: 'inventory_alarm_enabled' })
  inventoryAlarmEnabled: boolean = true;

  @ApiProperty({ description: '장기 재고 남은 일수', default: 50, type: Number })
  @Expose({ name: 'inventory_alarm_remaining_day' })
  inventoryAlarmRemainingDay: number = 50;

  @ApiProperty({ description: 'Crane 경고 비율', default: 80, type: Number })
  @Expose({ name: 'load_warning_ratio_crane' })
  loadWarningRatioCrane: number = 80;

  @ApiProperty({ description: 'Crane 위험 비율', default: 90, type: Number })
  @Expose({ name: 'load_danger_ratio_crane' })
  loadDangerRatioCrane: number = 90;

  @ApiProperty({ description: 'Crane 경고 색상', default: '##FF00FF', type: String })
  @Expose({ name: 'load_warning_color_crane' })
  loadWarningColorCrane: string = '##FF00FF';

  @ApiProperty({ description: 'Crane 위험 색상', default: '##FF00FF', type: String })
  @Expose({ name: 'load_danger_color_crane' })
  loadDangerColorCrane: string = '##FF00FF';

  @ApiProperty({ description: 'Gantry 경고 비율', default: 80, type: Number })
  @Expose({ name: 'load_warning_ratio_gantry' })
  loadWarningRatioGantry: number = 80;

  @ApiProperty({ description: 'Gantry 위험 비율', default: 90, type: Number })
  @Expose({ name: 'load_danger_ratio_gantry' })
  loadDangerRatioGantry: number = 90;

  @ApiProperty({ description: 'Gantry 경고 색상', default: '##FF00FF', type: String })
  @Expose({ name: 'load_warning_color_gantry' })
  loadWarningColorGantry: string = '##FF00FF';

  @ApiProperty({ description: 'Gantry 위험 색상', default: '##FF00FF', type: String })
  @Expose({ name: 'load_danger_color_gantry' })
  loadDangerColorGantry: string = '##FF00FF';
}