import { IsString, IsOptional, IsNumber, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { ACTION_TYPE, OPERATION_STATUS, TASK_TYPE } from 'src/common/enum/equipment.enum';

export class FilteringRealtimeEquipmentViewDto {
  @ApiProperty({ description: 'Realtime View ID', default: -1, type: Number })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  id: number;

  @ApiProperty({ description: '장비 ID', default: -1, type: Number })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  equipmentId: number;

  @ApiProperty({ description: '현재 상태', default: '', enum: OPERATION_STATUS })
  @IsOptional()
  @IsEnum(OPERATION_STATUS)
  status: OPERATION_STATUS;

  @ApiProperty({ description: '가동 유형', default: '', enum: TASK_TYPE })
  @IsOptional()
  @IsEnum(TASK_TYPE)
  taskType: TASK_TYPE;

  @ApiProperty({ description: '작업 유형', default: '', enum: ACTION_TYPE })
  @IsOptional()
  @IsEnum(ACTION_TYPE)
  actionType: ACTION_TYPE;
}