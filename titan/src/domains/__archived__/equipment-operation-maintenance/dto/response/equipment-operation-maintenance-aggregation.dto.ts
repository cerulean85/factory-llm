import { Expose, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { OPERATION_MAINTENANCE_TYPE, OPERATION_STATUS } from 'src/common/enum/equipment.enum';

class MaintenanceDetail {
  @ApiProperty({ description: '시작 시간', example: '2025-01-01T08:30:00Z' })
  startDate: Date;
  @ApiProperty({ description: '종료 시간', example: '2025-01-01T12:45:00Z' })
  endDate: Date;
  @ApiProperty({ description: '생성 시간', example: '2025-01-01T12:45:00Z' })
  createDate: Date;
  @ApiProperty({ description: '가동 보수 유형', example: OPERATION_MAINTENANCE_TYPE.DEFAULT})
  operationMaintenanceType: OPERATION_MAINTENANCE_TYPE;
  @ApiProperty({ description: '지속 시간 (분)', example: 120 })
  durationMin: number;
  @ApiProperty({ description: '상세 내용', example: '고장이 났습니다.' })
  description: string;
}
export class EquipmentOperationMaintenanceAggregationDto {
  @ApiProperty({ description: '설비Id', default: -1, type: Number })
  @Expose()
  equipmentId: number = -1;

  @ApiProperty({ description: '설비명', default: 'GANTRY_#2', type: String })
  @Expose()
  equipmentName: string = '';

  @ApiProperty({ description: '설비타입ID', default: '1', type: String })
  @Expose()
  equipmentTypeId: number = -1;

  @ApiProperty({ description: '설비타입명', default: 'GANTRY', type: String })
  @Expose()
  equipmentTypeName: string = '';

  @ApiProperty({ description: '가동현황상세내역', default: [], type: Number
    ,example: [
      {
        startTime: '2025-01-01 08:30:00',
        endTime: '2025-01-01 12:45:00',
        operationStatus: OPERATION_STATUS.START,
        operationMaintenanceType: OPERATION_MAINTENANCE_TYPE.DEFAULT,
        durationMin: 255,
        description: '고장이 났습니다.'
      },
      {
        startTime: '2025-01-01 13:30:00',
        endTime: '2025-01-01 18:00:00',
        operationStatus: OPERATION_STATUS.STOP,
        operationMaintenanceType: OPERATION_MAINTENANCE_TYPE.REPAIR,
        durationMin: 270,
        description: '고장이 났습니다.'
      },
    ],
  })
  @Expose()
  maintenanceDetailList : MaintenanceDetail[] = [];
}