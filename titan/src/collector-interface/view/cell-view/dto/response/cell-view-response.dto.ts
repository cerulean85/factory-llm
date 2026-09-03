import { Expose, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CELL_STATUS } from 'src/common/enum/cell.enum';

export class CellViewResponseDto {
  @ApiProperty({ description: 'Warehouse ID', example: 1, default: -1, type: Number})
  @Expose({ name: 'warehouse_id'})
  @Transform(({ obj }) => obj.warehouse?.id)
  warehouseId: number = -1;

  @ApiProperty({ description: 'Pallet ID', example: 1, default: -1, type: Number})
  @Expose({ name: 'pallet_id' })
  @Transform(({ obj }) => obj.pallet?.id)
  palletId: number = -1;

  @ApiProperty({ description: 'loc_x', example: 1, default: -1, type: Number})
  @Expose({ name: 'loc_x' })
  locX: number = -1;

  @ApiProperty({ description: 'loc_y', example: 1, default: -1, type: Number})
  @Expose({ name: 'loc_y' })
  locY: number = -1;

  @ApiProperty({ description: 'loc_z', example: 1, default: -1, type: Number})
  @Expose({ name: 'loc_z' })
  locZ: number = -1;

  @ApiProperty({ description: 'enable', example: true, default: true, type: Boolean})
  @Expose({ name: 'enable' })
  enable: boolean = true;

  @ApiProperty({ description: 'cell_status', example: CELL_STATUS.NORMAL, enum: CELL_STATUS})
  @Expose({ name: 'cell_status' })
  cellStatus: CELL_STATUS;

  @ApiProperty({ description: 'sku_key', example: '1234567890', default: '', type: String})
  @Expose({ name: 'sku_key' })
  skuKey: string = '';
  
  @ApiProperty({ description: 'standard_type', example: '1234567890', default: '', type: String})
  @Expose({ name: 'standard_type' })
  standardType: string = '';

  @ApiProperty({ description: 'st_count', example: 1, default: -1, type: Number})
  @Expose({ name: 'st_count' })
  stCount: number = -1;
  
  @ApiProperty({ description: 'in_date', example: new Date(), default: new Date(), type: Date})
  @Expose({ name: 'in_date' })
  inDate: Date = new Date();

  @ApiProperty({ description: 'update_date', example: new Date(), default: new Date(), type: Date})
  @Expose({ name: 'update_date' })
  updateDate: Date = new Date();

  @ApiProperty({ description: '화물 유무', example: false, default: false, type: Boolean})
  @Expose({ name: 'luggage_flag' })
  luggageFlag: boolean = false;

  @ApiProperty({ description: '배치 번호', example: '1234567890', default: '', type: String})
  @Expose({ name: 'batch_number' })
  batchNumber: string = '';

  @ApiProperty({ description: '오더 번호', example: '1234567890', default: '', type: String})
  @Expose({ name: 'order_number' })
  orderNumber: string = '';

  @ApiProperty({ description: '오더 순서', example: '1234567890', default: '', type: String})
  @Expose({ name: 'order_flow' })
  orderFlow: string = '';

  @ApiProperty({ description: '적재 위치 전체', example: -1, default: -1, type: Number})
  @Expose({ name: 'loc_all' })
  locAll: number = -1;

  @ApiProperty({ description: '적재 위치 전체', example: '1234', default: '', type: String})
  @Expose({ name: 'loc_unit' })
  locUnit: string = '';
}