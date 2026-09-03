import { Expose, Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsInt, IsNumber, IsOptional, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ACTION_TYPE, OPERATION_STATUS, TASK_TYPE, TWIN_STATUS } from 'src/common/enum/equipment.enum';

export class CreateRealtimeEquipmentViewDto {
  @ApiProperty({ name: 'speed', description: '속도', example: 1, default: -1, type: Number, required: true })
  @Expose({name: 'speed'})
  @Type(() => Number)
  speed: number;

  @ApiProperty({ name: 'status', description: '상태', example: OPERATION_STATUS.UNKNOWN, default: OPERATION_STATUS.UNKNOWN, enum: OPERATION_STATUS, required: true })
  @Expose({name: 'status'})
  status: OPERATION_STATUS | number;

  @ApiProperty({ name: 'bank', description: '위치 정보 x', example: 1, default: 0, type: Number, required: true })
  @Expose({name: 'x'})
  @Type(() => Number)
  loc_x: number;

  @ApiProperty({ name: 'bay', description: '위치 정보 y', example: 1, default: 0, type: Number, required: true })
  @Expose({name: 'y'})
  @Type(() => Number)
  loc_y: number;

  @ApiProperty({ name: 'level', description: '위치 정보 z', example: 1, default: 0, type: Number, required: true })
  @Expose({name: 'z'})
  @Type(() => Number)
  loc_z: number;

  @ApiProperty({ name: 'taskType', description: '가동유형', example: TASK_TYPE.NONE, default: TASK_TYPE.NONE, enum: TASK_TYPE, required: true })
  @Expose({name: 'taskType'})
  @IsEnum(TASK_TYPE)
  task_type: TASK_TYPE;

  @ApiProperty({ name: 'standardType', description: '타이어 타입', default: "", example: "SC-A0-123", type: String, required: false })
  @Expose({ name: 'standardType' })
  @IsOptional()
  @IsString()
  @Length(0, 100)
  standard_type: string = '';

  @ApiProperty({ name: 'stCount', description: '타이어 개수', default: 0, example: 0, type: Number, required: false })
  @Expose({ name: 'stCount' })
  @IsOptional()
  @IsNumber()
  st_count: number = 0;

  @ApiProperty({ name: 'equipmentId', description: '장비 ID', default: 1, example: 1, type: Number })
  @Expose({ name: 'equipmentId' })
  @IsInt()
  equipment_id: number;

  @ApiProperty({ name: 'twinStatus', description: 'TWIN 포크 위치', default: TWIN_STATUS.DEFAULT, enum: TWIN_STATUS })
  @Expose({ name: 'twinStatus' })
  @IsEnum(TWIN_STATUS)
  twin_status: TWIN_STATUS = TWIN_STATUS.DEFAULT;

  @ApiProperty({ name: 'loaded', description: '팔레트 적재 여부', default: false, type: Boolean })
  @Expose({ name: 'loaded' })
  @IsBoolean()
  loaded: boolean = false;

  @ApiProperty({ name: 'actionType', description: '작업 유형', default: ACTION_TYPE.NONE, enum: ACTION_TYPE })
  @Expose({ name: 'actionType' })
  @IsEnum(ACTION_TYPE)
  action_type: ACTION_TYPE = ACTION_TYPE.NONE;
}