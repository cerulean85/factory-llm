import { Expose, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { ACTION_TYPE, OPERATION_STATUS, TASK_TYPE, TWIN_STATUS } from 'src/common/enum/equipment.enum';

export class RealtimeEquipmentViewResponseDto {
  @ApiProperty({ description: 'Realtime Equipment View ID', default: -1, type: Number })
  @Expose()
  id: number = -1;

  @ApiProperty({ description: '장비 코드', example: 'G111', type: String })
  @Expose()
  @Transform(({ obj }) => obj.equipment?.code)
  equipmentCode: string = '';

  @ApiProperty({ description: '현재 속도', example: 0, default: 0, type: Number})
  @Expose()
  speed: number = -1;

  @ApiProperty({ description: '현재 상태', example: OPERATION_STATUS.START, default: OPERATION_STATUS.UNKNOWN, enum: OPERATION_STATUS})
  @Expose()
  status: OPERATION_STATUS = OPERATION_STATUS.UNKNOWN;

  @ApiProperty({ description: '위치 정보 x', example: 0, default: 0, type: Number})
  @Expose({ name: 'loc_x' })
  x: number = 0;

  @ApiProperty({ description: '위치 정보 y', example: 0, default: 0, type: Number})
  @Expose({ name: 'loc_y' })
  y: number = 0;

  @ApiProperty({ description: '위치 정보 z', example: 0, default: 0, type: Number})
  @Expose({ name: 'loc_z' })
  z: number = 0;

  @ApiProperty({ description: '가동 유형', example: TASK_TYPE.MOVE, default: TASK_TYPE.NONE, enum: TASK_TYPE})
  @Expose({name:'task_type'})
  taskType: TASK_TYPE = TASK_TYPE.NONE;

  @ApiProperty({ description: '타이어 규격', example: 'winter-tire', type: String})
  @Expose({name: 'standard_type'})
  productStandard: string = '';

  @ApiProperty({ description: '타이어 개수', example: 0, type: Number})
  @Expose({name: 'st_count'})
  productCount: number = 0;

  @ApiProperty({ description: '생성 날짜', example: 1, default: -1, type: Number})
  @Expose({ name: 'create_date' })
  createDate: number = -1;

  @ApiProperty({ description: '장비 유형 ID', example: 1, type: Number})
  @Expose()
  @Transform(({ obj }) => obj.equipment?.equipment_type?.id)
  equipmentTypeId: number = -1;

  @ApiProperty({ description: '장비 유형', example: 'GANTRY', type: String})
  @Expose()
  @Transform(({ obj }) => obj.equipment?.equipment_type?.name)
  equipmentTypeName: string = '';

  @ApiProperty({ description: '장비 ID', example: 1, type: Number})
  @Expose()
  @Transform(({ obj }) => obj.equipment?.id)
  equipmentId: number = -1;

  @ApiProperty({ description: '장비 이름', example: 'GANTRY 1-1-1', type: String})
  @Expose()
  @Transform(({ obj }) => obj.equipment?.name)
  equipmentName: string = '';

  @ApiProperty({ description: 'TWIN 포크 위치', example: TWIN_STATUS.DEFAULT, default: TWIN_STATUS.DEFAULT, enum: TWIN_STATUS})
  @Expose({ name: 'twin_status' })
  twinStatus: TWIN_STATUS = TWIN_STATUS.DEFAULT;

  @ApiProperty({ description: '팔레트 적재 여부', example: false, type: Boolean })
  @Expose({ name: 'loaded' })
  loaded: boolean = false;

  @ApiProperty({ description: '작업 유형', example: ACTION_TYPE.NONE, default: ACTION_TYPE.NONE, enum: ACTION_TYPE })
  @Expose({ name: 'action_type' })
  action: ACTION_TYPE = ACTION_TYPE.NONE;
}