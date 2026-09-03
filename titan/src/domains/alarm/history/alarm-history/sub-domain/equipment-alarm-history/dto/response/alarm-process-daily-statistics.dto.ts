import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";

export class DailyAlarmProcessStatusDto {
  @ApiProperty({ description: '날짜', example: '2024-05-18' })
  @Expose()
  date: string;

  @ApiProperty({ description: '해당 일자 알람 총 개수', example: 10 })
  @Expose()
  dayTotalCount: number = 0;

  @ApiProperty({ description: '해당 일자 처리된 알람 수', example: 7 })
  @Expose()
  dayProcessCount: number = 0;

  @ApiProperty({ description: '해당 처리된 알람 처리율(%)', example: 25.123 })
  @Expose()
  dayProcessRate: number = 0;
}

export class AlarmProcessDailyStatisticsDto {
  @ApiProperty({ type: [DailyAlarmProcessStatusDto], description: '날짜별 알람 처리 현황 리스트' })
  @Expose()
  @Type(() => DailyAlarmProcessStatusDto)
  data: DailyAlarmProcessStatusDto[];

  @ApiProperty({ description: '전체 알람 총 개수', example: 50 })
  @Expose()
  totalCount: number = 0;

  @ApiProperty({ description: '전체 처리된 알람 수', example: 42 })
  @Expose()
  processCount: number = 0;

  @ApiProperty({ description: '전체 처리율(%)', example: 84 })
  @Expose()
  processRate: number = 0;
}