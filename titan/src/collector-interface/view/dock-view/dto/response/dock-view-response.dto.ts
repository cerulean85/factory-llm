import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class DockViewResponseDto {
  @ApiProperty({ description: 'Dock ID', default: -1, type: Number })
  @Expose()
  id: number = -1;

  @ApiProperty({ description: 'Gantry Code', example: 1, default: -1, type: Number})
  @Expose({ name: 'gantry_code' })
  gantryCode: number = -1;

  @ApiProperty({ description: 'Dock 번호', example: 1, default: -1, type: Number})
  @Expose({ name: 'dock_no' })
  dockNo: number = -1;

  @ApiProperty({ description: 'status', example: '출고 상태', default: '', type: String})
  @Expose()
  status: string = '';

  @ApiProperty({ description: 'ERP 오더 번호', example: 1, default: -1, type: Number})
  @Expose({ name: 'shipment_order' })
  shipmentOrder: number = -1;

  @ApiProperty({ description: '컨테이너 번호', example: 1, default: -1, type: Number})
  @Expose({ name: 'container_no' })
  containerNo: string = '';

  @ApiProperty({ description: '한 오더 내 오더 개수', example: 1, default: -1, type: Number})
  @Expose({ name: 'unit_order_count' })
  unitOrderCount: number = -1;

  @ApiProperty({ description: '오더 수량', example: 1, default: -1, type: Number})
  @Expose({ name: 'order_count' })
  orderCount: number = -1;

  @ApiProperty({ description: '출고 중 수량', example: 1, default: -1, type: Number})
  @Expose({ name: 'outing_count' })
  outingCount: number = -1;
  
  @ApiProperty({ description: 'Gantry 내 수량', example: 1, default: -1, type: Number})
  @Expose({ name: 'in_gantry_count' })
  inGantryCount: number = -1;

  @ApiProperty({ description: '컨베이어 내 수량', example: 1, default: -1, type: Number})
  @Expose({ name: 'conveyor_count' })
  conveyorCount: number = -1;
  
  @ApiProperty({ description: '완료 수량', example: 1, default: -1, type: Number})
  @Expose({ name: 'completion_count' })
  completionCount: number = -1;

  @ApiProperty({ description: '보류 수량', example: 1, default: -1, type: Number})
  @Expose({ name: 'remand_count' })
  remandCount: number = -1;
  
  @ApiProperty({ description: '불량 수량', example: 1, default: -1, type: Number})
  @Expose({ name: 'bad_count' })
  badCount: number = -1;
}