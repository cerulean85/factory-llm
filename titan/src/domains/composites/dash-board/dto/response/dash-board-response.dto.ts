import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";

class PalletCurrentCountsDto {
  @ApiProperty({ description: '현재 재고 수량', default: -1, type: Number })
  @Expose()
  currentCount: number;

  @ApiProperty({ description: '총 재고 수량', default: -1, type: Number })
  @Expose()
  totalCount: number;

  @ApiProperty({ description: '재고 비율', default: -1, type: Number })
  @Expose()
  rate: number;

  @ApiProperty({ description: '공 쉘프 수', default: -1, type: Number })
  @Expose()
  emptyCellCount: number;
}

class EquipmentAlarmProcessStatusDto {
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

class AlarmHistoryEquipmentStatusDto {
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

class DailyEquipmentCountsDto {
  @ApiProperty({ example: '2025-05-07', description: '날짜' })
  @Expose()
  date: string = '';
 
  @ApiProperty({ example: 25, description: '출고 개수' })
  @Expose()
  currentCount: number = -1;

  @ApiProperty({ example: 50, description: '누적 출고 개수' })
  @Expose()
  cumulativeCount: number = -1;
}

class WarehouseStackedCountsDto {
  @ApiProperty({ description: '창고 ID', default: -1, type: Number })
  @Expose()
  warehouseId: number = -1;

  @ApiProperty({ description: 'StackArea (STC:Equipment기준, GTR:Warehouse기준)', default: '', type: String })
  @Expose()
  stackAreaName: string = '';

  @ApiProperty({ description: '특정 창고에 쌓인 개수', default: -1, type: Number })
  @Expose()
  currentCount: number = -1;
  
  @ApiProperty({ description: '빈 쉘프 수량', default: -1, type: Number })
  @Expose()
  emptyCellCount: number = -1;
}

export class DashBoardResponseDto {
  @ApiProperty({ example: new PalletCurrentCountsDto(), description: '팔레트 재고 현황' })
  @Expose()
  palletCurrentCounts: PalletCurrentCountsDto;

  @ApiProperty({ example: new AlarmHistoryEquipmentStatusDto(), description: '설비별 알람 처리 현황' })
  @Expose()
  alarmHistoryEquipmentStatus: AlarmHistoryEquipmentStatusDto;

  @ApiProperty({ example: new DailyEquipmentCountsDto(), description: '크래인 출고 현황' })
  @Expose()
  dailyCraneCounts: DailyEquipmentCountsDto[] = [];

  @ApiProperty({ example: new DailyEquipmentCountsDto(), description: '갠트리 출고 현황' })
  @Expose()
  dailyGantryCounts: DailyEquipmentCountsDto[] = [];

  @ApiProperty({ example: new WarehouseStackedCountsDto(), description: '크래인 적치 현황' })
  @Expose()
  craneStackedCounts: WarehouseStackedCountsDto[] = [];

  @ApiProperty({ example: new WarehouseStackedCountsDto(), description: '갠트리 적치 현황' })
  @Expose()
  gantryStackedCounts: WarehouseStackedCountsDto[] = [];
}