import { Expose, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class PalletAlarmHistoryResponseDto {
  @ApiProperty({ description: 'Pallet 알람 내역 번호', default: -1, type: Number })
  @Expose({ name: 'pallet_alarm_history_id'  })
  @Transform(({ obj }) => obj.id)
  palletAlarmHistoryId: number = -1;

  @ApiProperty({ description: '알람 내역 ID', default: -1, type: Number })
  @Expose({ name: 'alarm_history_id' })
  @Transform(({ obj }) => obj.alarm_history.id)
  alarmHistoryId: number = -1;

  @ApiProperty({ description: '재고개수', default: 0, type: Number })
  @Expose({ name: 'warning_count' })
  warningCount: number = 0;
}