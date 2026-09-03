import { Expose, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { OPERATION_MAINTENANCE_TYPE, OPERATION_STATUS } from 'src/common/enum/equipment.enum';

export class OperationDetail {
  @ApiProperty({ description: '설비 가동 이력 ID', example: '0' })
  equipmentOperationHistoryId: number;
  @ApiProperty({ description: '시작 시간', example: '2025-01-01T08:30:00Z' })
  startDate: string;
  @ApiProperty({ description: '종료 시간', example: '2025-01-01T12:45:00Z' })
  endDate: string;
  @ApiProperty({ description: '가동 상태', example: OPERATION_STATUS.START })
  operationStatus: OPERATION_STATUS;
  @ApiProperty({ description: '가동 보수 유형', example: OPERATION_MAINTENANCE_TYPE.DEFAULT})
  operationMaintenanceType: OPERATION_MAINTENANCE_TYPE;
  @ApiProperty({ description: '지속 시간 (분)', example: 120 })
  durationMin: number;
  @ApiProperty({ description: '상세 내용', example: '고장이 났습니다.' })
  description: string;
}
export class EquipmentOperationHistoryAggregationDto {
  @ApiProperty({ description: '설비Id', default: -1, type: Number })
  @Expose()
  equipmentId: number = -1;

  @ApiProperty({ description: '설비명', default: 'GANTRY_#2', type: String })
  @Expose()
  equipmentName: string = '';

  @ApiProperty({ description: '설비코드(식별자)', default: 'gtr-123-sv', type: String })
  @Expose()
  equipmentCode: string = '';

  @ApiProperty({ description: '설비타입ID', default: '1', type: String })
  @Expose()
  equipmentTypeId: number = -1;

  @ApiProperty({ description: '설비타입명', default: 'GANTRY', type: String })
  @Expose()
  equipmentTypeName: string = '';

  @ApiProperty({ description: '현재설비상태', default: OPERATION_STATUS.START, enum: OPERATION_STATUS })
  @Expose()
  currentOperationStatus: OPERATION_STATUS = OPERATION_STATUS.START;

  @ApiProperty({ description: '총 고장 시간(Min)', default: 0, type: Number })
  @Expose()
  totalStopMin: number = 0;

  @ApiProperty({ description: '총 가용 시간(Min)', default: 0, type: Number })
  @Expose()
  totalRunningMin: number = 0;

  @ApiProperty({ description: '총 복구 시간', default: 0, type: Number })
  @Expose()
  totalFaultMin: number = 0;

  @ApiProperty({ description: '가동률', default: 0, type: Number })
  @Expose()
  operationRate: number = 0;

  @ApiProperty({ description: '고장률', default: 0, type: Number })
  @Expose()
  faultRate: number = 0;

  @ApiProperty({ description: '가동현황상세내역', default: [], type: Number
    ,example: [
      {
        startTime: '2025-01-01 08:30:00',
        endTime: '2025-01-01 12:45:00',
        operationStatus: OPERATION_STATUS.START,
        operationMaintenanceType: OPERATION_MAINTENANCE_TYPE.DEFAULT,
        durationMin: 255,
      },
      {
        startTime: '2025-01-01 13:30:00',
        endTime: '2025-01-01 18:00:00',
        operationStatus: OPERATION_STATUS.STOP,
        operationMaintenanceType: OPERATION_MAINTENANCE_TYPE.REPAIR,
        durationMin: 270,
      },
    ],
  })
  @Expose()
  operationDetailList : OperationDetail[] = [];
}