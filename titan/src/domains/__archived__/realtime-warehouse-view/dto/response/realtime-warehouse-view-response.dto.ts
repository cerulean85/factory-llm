import { Expose, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CELL_USE_TYPE, WAREHOUSE_TYPE } from 'src/common/enum/equipment.enum';

export class RealtimeWarehouseViewResponseDto {
  @ApiProperty({ description: '설비 코드', example: 'G111', type: String })
  @Expose({ name: 'equipment_code' })
  equipmentCode: string = '';

  @ApiProperty({ description: '설비 가동 뷰 ID', default: -1, type: Number })
  @Expose()
  id: number = -1;

  @ApiProperty({ description: 'bay', default: 0, type: Number })
  @Expose({ name: 'loc_x' })
  x: number = 0;

  @ApiProperty({ description: 'bank', default: 0, type: Number })
  @Expose({ name: 'loc_y' })
  y: number = 0;

  @ApiProperty({ description: 'level', default: 0, type: Number })
  @Expose({ name: 'loc_z' })
  z: number = 0;

  @ApiProperty({ description: 'Pallet 적재 여부', example: true, default: true, type: Boolean })
  @Expose()
  loaded: boolean = true;

  @ApiProperty({ description: 'shelf 사용 유형', default: CELL_USE_TYPE.NORMAL, enum: CELL_USE_TYPE })
  @Expose({ name: 'use_type'})
  useType: CELL_USE_TYPE = CELL_USE_TYPE.NORMAL;

  @ApiProperty({ description: '창고 ID', default: -1, type: Number })
  @Expose({ name: 'warehouse_id' })
  @Transform(({ obj }) => obj.warehouse?.id)
  warehouseId: number = -1;

  @ApiProperty({ description: '창고 타입', default: WAREHOUSE_TYPE.CRANE, enum: WAREHOUSE_TYPE })
  @Expose({ name: 'warehouse_type' })
  @Transform(({ obj }) => obj.warehouse?.type)
  warehouseType: WAREHOUSE_TYPE = WAREHOUSE_TYPE.CRANE;

  @ApiProperty({ description: '타이어 규격', example: 'winter-tire', type: String })
  @Expose({ name: 'standard_type' })
  productStandard: string = '';

  @ApiProperty({ description: '타이어 개수', example: 0, type: Number })
  @Expose({ name: 'st_count' })
  productCount: number = 0;
}