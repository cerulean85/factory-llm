import { ApiProperty } from '@nestjs/swagger'
import { Transform, Expose, Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { DateTransform } from 'src/common/decorator/date-transform.decorator';
import { OPERATION_MAINTENANCE_TYPE, OPERATION_STATUS } from 'src/common/enum/equipment.enum';

export class CreateEquipmentOperationMaintenanceDto {
  @ApiProperty({ name: 'equipmentId', description: '설비 ID', example: 1, default: -1, type: Number })
  @Expose({ name: 'equipmentId' })
  @Transform(({ obj }) => obj.equipmentId)
  @IsInt()
  equipment_id: number = -1;

  @ApiProperty({ name: 'startDate', description: '시작일시', example: '2025-07-10T08:00:00', default: null, type: Date})
  @DateTransform()
  @Expose({name: 'startDate'})
  start_date: Date;

  @ApiProperty({ name: 'endDate', description: '종료일시', example: '2025-07-10T10:00:00', default: null, type: Date})
  @DateTransform()
  @Expose({name: 'endDate'})
  end_date: Date;

  @ApiProperty({ name: 'operationMaintenanceType', description: '가동 보수 유형', default: OPERATION_MAINTENANCE_TYPE.DEFAULT, enum: OPERATION_MAINTENANCE_TYPE})
  @Expose({name: 'operationMaintenanceType'})
  @IsEnum(OPERATION_MAINTENANCE_TYPE)
  operation_maintenance_type: OPERATION_MAINTENANCE_TYPE;

  @ApiProperty({ description: 'description', example: 'test_description', default: '', type: String })
  @Expose()
  @IsOptional()
  @Type(() => String)
  @IsString()
  description: string = "";
}