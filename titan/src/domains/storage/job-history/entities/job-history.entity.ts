import { ApiProperty } from '@nestjs/swagger';
import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne } from 'typeorm';
import { Equipment } from 'src/domains/equipment/equipment/entities/equipment.entity';
import { Pallet } from '../../pallet/entities/pallet.entity';
import { TASK_TYPE, WORKING_STATUS } from 'src/common/enum/equipment.enum';
import { Warehouse } from '../../warehouse/entities/warehouse.entity';

@Entity('job_history')
export class JobHistory {
  @ApiProperty({ description: 'job 내역 ID', default: -1, type: Number })
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => Pallet, (pallet) => pallet.id, { nullable: true })
  @JoinColumn({ name: 'pallet_id' })
  pallet: Pallet | null;

  @ManyToOne(() => Warehouse, (warehouse) => warehouse.id)
  @JoinColumn({ name: 'warehouse_id' })
  warehouse: Warehouse;

  @ApiProperty({ description: '품목 키', default: '', type: String })
  @Column({ type: 'varchar', length: 20, default: '' })
  sku_key: string;

  @ApiProperty({ description: '품목 이름', default: '', type: String })
  @Column({ type: 'varchar', length: 100, default: '' })
  standard_type: string;

  @ApiProperty({ description: '작업 상태', default: WORKING_STATUS.COMPLETE, enum: WORKING_STATUS })
  @Column({ type: 'varchar', length: 10, default: WORKING_STATUS.COMPLETE })
  working_status: WORKING_STATUS;

  @ApiProperty({ description: '품목 수량', default: -1, type: Number })
  @Column({ type: 'int', default: -1 })
  st_count: number;

  @ApiProperty({ description: '위치 정보', default: '', type: String })
  @Column({ type: 'varchar', length: 20, default: '' })
  loc_raw: string;

  @ApiProperty({ description: '입고, 출고, 이동', default: TASK_TYPE.NONE, enum: TASK_TYPE })
  @Column({ type: 'varchar', length: 10, default: TASK_TYPE.NONE })
  task_type: TASK_TYPE;

  @ApiProperty({ description: '배치 번호', default: '', type: String })
  @Column({ type: 'varchar', length: 10, default: '' })
  batch_number: string;

  @ApiProperty({ description: '오더 번호', default: '', type: String })
  @Column({ type: 'varchar', length: 20, default: '' })
  order_number: string;

  @ApiProperty({ description: '오더 순서', default: '', type: String })
  @Column({ type: 'varchar', length: 10, default: '' })
  order_flow: string;

  @ApiProperty({ description: '작업 일자', default: '', type: Date })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  job_date: Date;

  @ApiProperty({ description: '생성 날짜', default: '', type: Date })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  create_date: Date;
}