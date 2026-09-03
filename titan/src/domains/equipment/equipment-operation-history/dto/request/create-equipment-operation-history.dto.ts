import { ApiProperty } from '@nestjs/swagger'
import { Transform, Expose, Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { DateTransform } from 'src/common/decorator/date-transform.decorator';
import { OPERATION_MAINTENANCE_TYPE, OPERATION_STATUS } from 'src/common/enum/equipment.enum';

export class CreateEquipmentOperationHistoryDto {
  @ApiProperty({ name: 'equipmentId', description: '설비 ID', example: 1, default: -1, type: Number })
  @Expose({ name: 'equipmentId' })
  @Transform(({ obj }) => obj.equipmentId)
  @IsInt()
  equipment_id: number = -1;

  @ApiProperty({ name: 'operationStatus', description: '가동 상태', default: OPERATION_STATUS.START, enum: OPERATION_STATUS })
  @Expose({ name: 'operationStatus' })
  operation_status: OPERATION_STATUS | number;

  @ApiProperty({ name: 'operationMaintenanceType', description: '가동 보수 유형', default: OPERATION_MAINTENANCE_TYPE.DEFAULT, enum: OPERATION_MAINTENANCE_TYPE, required: false})
  @Expose({name: 'operationMaintenanceType'})
  @IsEnum(OPERATION_MAINTENANCE_TYPE)
  @IsOptional()
  operation_maintenance_type: OPERATION_MAINTENANCE_TYPE = OPERATION_MAINTENANCE_TYPE.DEFAULT;


  @ApiProperty({ description: 'description', example: 'test_description', default: '', type: String })
  @Expose()
  @IsOptional()
  @Type(() => String)
  @IsString()
  description: string = "";

  @ApiProperty({name: 'createDate', description: '생성(시작)시간', default: new Date(), required: false})
  @Expose({name: 'createDate'})
  @DateTransform()
  @IsOptional()
  create_date: Date = new Date();
}