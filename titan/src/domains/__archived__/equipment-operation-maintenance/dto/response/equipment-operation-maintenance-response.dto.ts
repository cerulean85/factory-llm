import { Expose, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { OPERATION_MAINTENANCE_TYPE, OPERATION_STATUS } from 'src/common/enum/equipment.enum';

export class EquipmentOperationMaintenanceResponseDto {
  @ApiProperty({ description: '설비 가동 이력 ID', default: -1, type: Number })
  @Expose()
  id: number = -1;

  @ApiProperty({ description: '생성일자', default: new Date(), type: Date })
  @Expose({ name: 'create_date' })
  createDate: Date = new Date();

  @ApiProperty({ description: '가동 보수 유형', default: OPERATION_MAINTENANCE_TYPE.DEFAULT, enum: OPERATION_MAINTENANCE_TYPE })
  @Expose({ name: 'operation_maintenance_type' })
  operationMaintenanceType: OPERATION_MAINTENANCE_TYPE;

  @ApiProperty({ description: '보수 시작 일자', default: new Date(), type: Date })
  @Expose({ name: 'start_date' })
  startDate: Date = new Date();

  @ApiProperty({ description: '보수 종료 일자', default: new Date(), type: Date })
  @Expose({ name: 'end_date' })
  endDate: Date = new Date();

  @ApiProperty({ description: '상세 내용', default: '', type: String })
  @Expose()
  description: string = '';

  @ApiProperty({ description: '설비 ID', default: -1, type: Number })
  @Expose()
  @Transform(({ obj }) => obj.equipment?.id)
  equipmentId: number = -1;

  @ApiProperty({ description: '설비 이름', default: '', type: String })
  @Expose()
  @Transform(({ obj }) => obj.equipment?.name)
  equipmentName: string = '';

  @ApiProperty({ description: '설비 유형 이름', default: '', type: String })
  @Expose()
  @Transform(({ obj }) => obj.equipment?.equipmentType?.name)
  equipmentTypeName: string = '';

  @ApiProperty({ description: '설비 유형 ID', default: -1, type: Number })
  @Expose()
  @Transform(({ obj }) => obj.equipment?.equipmentType?.id)
  equipmentTypeId: number = -1;
}