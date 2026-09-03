import { ApiProperty } from '@nestjs/swagger';
import { CELL_USE_TYPE } from 'src/common/enum/equipment.enum';
import { Warehouse } from 'src/domains/storage/warehouse/entities/warehouse.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity('realtime_warehouse_view')
export class RealtimeWarehouseView {
  @ApiProperty({ description: '설비 가동 뷰 ID', default: -1, type: Number })
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ApiProperty({ description: '설비 코드', default: '', type: String })
  @Column({ type: 'varchar', length: 50 })
  equipment_code: string;

  @ApiProperty({ description: '위치정보 bay', default: 0, type: Number })
  @Column({ type: 'int' })
  loc_x: number;

  @ApiProperty({ description: '위치정보 bank', default: 0, type: Number })
  @Column({ type: 'int' })
  loc_y: number;

  @ApiProperty({ description: '위치정보 level', default: 0, type: Number })
  @Column({ type: 'int' })
  loc_z: number;

  @ApiProperty({ description: 'Pallet 적재 여부', default: true, type: Boolean })
  @Column({ type: 'boolean' })
  loaded: boolean;

  @ApiProperty({ description: 'shelf 사용 유형', default: CELL_USE_TYPE.NORMAL, enum: CELL_USE_TYPE })
  @Column({ type: 'enum', enum: CELL_USE_TYPE })
  use_type: CELL_USE_TYPE;

  @ApiProperty({ description: '창고', default: new Warehouse(), type: Warehouse })
  @ManyToOne(() => Warehouse, (warehouse) => warehouse.id)
  @JoinColumn({ name: 'warehouse_id' })
  warehouse: Warehouse;

  @ApiProperty({ description: '타이어 규격', default: '', type: String })
  @Column({ type: 'varchar', length: 100 })
  standard_type: string;

  @ApiProperty({ description: '타이어 개수', default: 0, type: Number })
  @Column({ type: 'int' })
  st_count: number;
}