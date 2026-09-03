import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { OPERATION_MAINTENANCE_TYPE } from 'src/common/enum/equipment.enum';

export class UpdateEquipmentOperationMaintenanceDto{
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