import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";

export class EquipmentAlarmProcessStatusDto {
  @ApiProperty({ description: '설비', example: 'GANTRY' })
  @Expose()
  equipmentName: string;

  @ApiProperty({ description: '해당 설비 알람 총 개수', example: 10 })
  @Expose()
  equipmentTotalCount: number = 0;

  @ApiProperty({ description: '해당 설비 처리된 알람 수', example: 7 })
  @Expose()
  equipmentProcessCount: number = 0;

  @ApiProperty({ description: '해당 설비 처리된 알람 처리율(%)', example: 25.123 })
  @Expose()
  equipmentProcessRate: number = 0;
}

export class AlarmProcessEquipmentStatisticsDto {
  @ApiProperty({ type: [EquipmentAlarmProcessStatusDto], description: '설비별 알람 처리 현황 리스트' })
  @Expose()
  @Type(() => EquipmentAlarmProcessStatusDto)
  data: EquipmentAlarmProcessStatusDto[];

  @ApiProperty({ description: '전체 알람 총 개수', example: 50 })
  @Expose()
  totalCount: number = 0;

  @ApiProperty({ description: '전체 처리된 알람 수', example: 42 })
  @Expose()
  processCount: number = 0;

  @ApiProperty({ description: '전체 처리율(%)', example: 84.234 })
  @Expose()
  processRate: number = 0;
}