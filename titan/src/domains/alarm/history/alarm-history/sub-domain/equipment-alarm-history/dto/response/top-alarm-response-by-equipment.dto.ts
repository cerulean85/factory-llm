import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

class AlarmItemDto {
  @ApiProperty({ description: '순위', example: 1, type: Number })
  @Expose()
  rank: number;

  @ApiProperty({ description: '알람 코드', example: '1', type: String })
  @Expose()
  alarmCode: string;

  @ApiProperty({ description: '알람 설명', example: 'DESCRIPTION', type: String })
  @Expose()
  alarmDesc: string;

  @ApiProperty({ description: '발생 횟수', example: 50, type: Number })
  @Expose()
  count: number;
}

export class EquipmentUnitDto {
  @ApiProperty({ description: '설비 호기', example: 'GANTRY_#1', type: String })
  @Expose()
  equipmentUnit: string;

  @ApiProperty({ description: '상위 알람 목록', type: AlarmItemDto, isArray: true })
  @Expose()
  alarms: AlarmItemDto[];
}

export class TopAlarmResponseByEquipmentDto {
  @ApiProperty({ description: '설비 유형', example: 'GANTRY', type: String })
  @Expose()
  equipmentType: string;

  @ApiProperty({ description: '설비 호기별 정보', type: EquipmentUnitDto, isArray: true })
  @Expose()
  units: EquipmentUnitDto[];
}