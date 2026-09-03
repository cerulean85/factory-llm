import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Equipment } from 'src/domains/equipment/equipment/entities/equipment.entity';
import { ApiProperty } from '@nestjs/swagger';
import { TASK_TYPE } from 'src/common/enum/equipment.enum';
import { Pallet } from 'src/domains/storage/pallet/entities/pallet.entity';
import { ItemMasterView } from 'src/collector-interface/view/item-master-view/entities/item-master-view.entity';
import { Warehouse } from 'src/domains/storage/warehouse/entities/warehouse.entity';

@Entity('job_queue')
export class JobQueue {
  @ApiProperty({ description: '잡큐 ID', default: -1, type: Number })
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ApiProperty({ description: '설비 ID', default: -1, type: Warehouse })
  @ManyToOne(() => Warehouse, (warehouse) => warehouse.id)
  @JoinColumn({ name: 'warehouse_id' })
  warehouse: Warehouse;

  @ApiProperty({ description: 'pallet ID', default: -1, type: Pallet })
  @ManyToOne(() => Pallet, (pallet) => pallet.id)
  @JoinColumn({ name: 'pallet_id' })
  pallet: Pallet;

  @ApiProperty({ description: '품목키', default: '', type: ItemMasterView })
  @ManyToOne(() => ItemMasterView, (itemMasterView) => itemMasterView.sku_key, { nullable: true })
  @JoinColumn({ name: 'sku_key' })
  item_master_view: ItemMasterView | null;

  @ApiProperty({ description: '작업 상태', default: '', type: String })
  @Column({ type: 'varchar', length: 10, default: '', nullable: true })
  working_status: string | null;
  
  @ApiProperty({ description: '품목수량', default: 0, type: Number })
  @Column({ type: 'int', default: 0, nullable: true })
  st_count: number | null;

  @ApiProperty({ description: '위치 정보(raw)', default: '', type: String })
  @Column({ type: 'varchar', length: 20, default: '', nullable: true })
  loc_raw: string | null;

  @ApiProperty({ description: '입고,출고,이동', default: '', type: String })
  @Column({ type: 'varchar', length: 10, default: '', nullable: true })
  task_type: string | null;

  @ApiProperty({ description: '배치번호', default: '', type: String })
  @Column({ type: 'varchar', length: 10, default: '', nullable: true })
  batch_number: string | null;

  @ApiProperty({ description: '오더번호', default: '', type: String })
  @Column({ type: 'varchar', length: 20, default: '', nullable: true })
  order_number: string | null;

  @ApiProperty({ description: '오더순서', default: '', type: String })
  @Column({ type: 'varchar', length: 10, default: '', nullable: true })
  order_flow: string | null;

  @ApiProperty({ description: '작업일자', default: new Date(), type: Date })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  job_date: Date;
}