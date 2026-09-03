import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, ManyToOne, JoinColumn, Index, PrimaryGeneratedColumn } from 'typeorm';
import { Pallet } from 'src/domains/storage/pallet/entities/pallet.entity';
import { CELL_STATUS } from 'src/common/enum/cell.enum';
import { Warehouse } from 'src/domains/storage/warehouse/entities/warehouse.entity';

@Entity('cell_view')
//@Index('idx_cell_view_equipment', ['equipment'])
//@Index('idx_cell_view_equipment_type', ['equipment_type'])
@Index('idx_cell_view_pallet', ['pallet'])
//@Index('idx_cell_view_warehouse', ['warehouse'])
export class CellView {
  @ApiProperty({ description: 'Cell View ID', default: -1, type: Number })
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ApiProperty({ description: 'Warehouse', default: null, type: Warehouse })
  @ManyToOne(() => Warehouse, (warehouse) => warehouse.id)
  @JoinColumn({ name: 'warehouse_id' })
  warehouse: Warehouse;

  @ApiProperty({ description: 'Pallet', default: null, type: Pallet })
  @ManyToOne(() => Pallet, (pallet) => pallet.id, { nullable: true })
  @JoinColumn({ name: 'pallet_id'})
  pallet: Pallet | null;

  @ApiProperty({ description: '적재 위치 (bank)', default: -1, type: Number })
  @Column({ type: 'int', default: -1, nullable: true })
  loc_x: number;

  @ApiProperty({ description: '적재 위치 (bay)', default: -1, type: Number })
  @Column({ type: 'int', default: -1, nullable: true })
  loc_y: number;

  @ApiProperty({ description: '적재 위치 (level)', default: -1, type: Number })
  @Column({ type: 'int', default: -1, nullable: true })
  loc_z: number;

  @ApiProperty({ description: '사용 여부', default: true, type: Boolean })
  @Column({ type: 'boolean', default: true })
  enable: boolean;

  @ApiProperty({ description: '셀 상태', default: CELL_STATUS.NORMAL, enum: CELL_STATUS })
  @Column({ type: 'varchar', length: 30 })
  cell_status: CELL_STATUS;

  @ApiProperty({ description: '품목 코드', default: '', type: String })
  @Column({ type: 'varchar', length: 30, nullable: true })
  sku_key: string;

  @ApiProperty({ description: '타이어 규격', default: '', type: String })
  @Column({ type: 'varchar', length: 100, nullable: true })
  standard_type: string;

  @ApiProperty({ description: '타이어 개수', default: 0, type: Number })
  @Column({ type: 'int', default: -1, nullable: true })
  st_count: number;

  @ApiProperty({ description: '입고 일자', default: new Date(), type: Date })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: true })
  in_date: Date;

  @ApiProperty({ description: '정보 변경 일자', default: new Date(), type: Date })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP', nullable: true })
  update_date: Date;
  
  @ApiProperty({ description: '화물유무', default: false, type: Boolean })
  @Column({ type: 'boolean', default: false })
  luggage_flag: boolean;

  @ApiProperty({ description: '배치번호', default: '', type: String })
  @Column({ type: 'varchar', length: 30, nullable: true })
  batch_number: string;

  @ApiProperty({ description: '오더번호', default: '', type: String })
  @Column({ type: 'varchar', length: 30, nullable: true })
  order_number: string;

  @ApiProperty({ description: '오더순서', default: '', type: String })
  @Column({ type: 'varchar', length: 10, nullable: true })
  order_flow: string;

  @ApiProperty({ description: '적재 위치 전체', default: -1, type: Number })
  @Column({ type: 'varchar', length: 50, unique: true })
  loc_all: number;

  @ApiProperty({ description: '적재 위치 전체', default: '', type: String })
  @Column({ type: 'varchar', length: 50, nullable: true })
  loc_unit: string;
}