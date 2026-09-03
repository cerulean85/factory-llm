import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSystemDto {
  @ApiProperty({
    description: '알람 전송 여부',
    default: true,
    example: true,
    type: Boolean,
  })
  @Expose({ name: 'alarmSendEnabled' })
  alarm_send_enabled: boolean = true;

  @ApiProperty({
    description: '설비 알람 전송 여부',
    default: true,
    example: true,
    type: Boolean,
  })
  @Expose({ name: 'equipmentAlarmEnabled' })
  equipment_alarm_enabled: boolean = true;

  @ApiProperty({
    description: '재고 알람 전송 여부',
    default: true,
    example: true,
    type: Boolean,
  })
  @Expose({ name: 'inventoryAlarmEnabled' })
  inventory_alarm_enabled: boolean = true;

  @ApiProperty({
    description: '장기 재고 남은 일수',
    default: 50,
    example: 50,
    type: Number,
  })
  @Expose({ name: 'inventoryAlarmRemainingDay' })
  inventory_alarm_remaining_day: number = 50;

  @ApiProperty({
    description: 'Crane 경고 비율',
    default: 80,
    example: 80,
    type: Number,
  })
  @Expose({ name: 'loadWarningRatioCrane' })
  load_warning_ratio_crane: number = 80;

  @ApiProperty({
    description: 'Crane 위험 비율',
    default: 90,
    example: 90,
    type: Number,
  })
  @Expose({ name: 'loadDangerRatioCrane' })
  load_danger_ratio_crane: number = 90;

  @ApiProperty({
    description: 'Crane 경고 색상',
    default: '##FF00FF',
    example: '###FF00FF',
    type: String,
  })
  @Expose({ name: 'loadWarningColorCrane' })
  load_warning_color_crane: string = '#FF00FF';

  @ApiProperty({
    description: 'Crane 위험 색상',
    default: '##FF00FF',
    example: '###FF00FF',
    type: String,
  })
  @Expose({ name: 'loadDangerColorCrane' })
  load_danger_color_crane: string = '#FF00FF';

  @ApiProperty({
    description: 'Gantry 경고 비율',
    default: 80,
    example: 80,
    type: Number,
  })
  @Expose({ name: 'loadWarningRatioGantry' })
  load_warning_ratio_gantry: number = 80;

  @ApiProperty({
    description: 'Gantry 위험 비율',
    default: 90,
    example: 90,
    type: Number,
  })
  @Expose({ name: 'loadDangerRatioGantry' })
  load_danger_ratio_gantry: number = 90;

  @ApiProperty({
    description: 'Gantry 경고 색상',
    default: '##FF00FF',
    example: '###FF00FF',
    type: String,
  })
  @Expose({ name: 'loadWarningColorGantry' })
  load_warning_color_gantry: string = '#FF00FF';

  @ApiProperty({
    description: 'Gantry 위험 색상',
    default: '##FF00FF',
    example: '###FF00FF',
    type: String,
  })
  @Expose({ name: 'loadDangerColorGantry' })
  load_danger_color_gantry: string = '#FF00FF';

  @ApiProperty({
    description: '웹 브라우저 새로고침 강제',
    default: false,
    type: Boolean,
  })
  @Expose({ name: 'refreshBrowser' })
  refresh_browser: boolean;
}
