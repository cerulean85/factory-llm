import { EquipmentType } from 'src/domains/equipment/equipment-type/entities/equipment-type.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Warehouse } from 'src/domains/storage/warehouse/entities/warehouse.entity';

@Index('idx_equipment_id_type_id', ['id', 'equipment_type'])

@Entity('equipment')
export class Equipment {
  @ApiProperty({ description: '장비 ID', default: -1, type: Number })
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ApiProperty({ description: '설비 스펙', default: '', type: String })
  @Column({ type: 'varchar', default: '', length: 500})
  spec: string;

  @ApiProperty({ description: '사용자 생성 날짜', default: new Date(), type: Date })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  create_date: Date;

  @ApiProperty({ description: '정보 변경 날짜', default: new Date(), type: Date })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  update_date: Date;

  @ApiProperty({ description: '사용 여부', default: true, type: Boolean })
  @Column({ type: 'boolean', default: true })
  valid_record: boolean;

  @ApiProperty({ description: '설비 타입', default: new EquipmentType(), type: EquipmentType })
  @ManyToOne(() => EquipmentType, (equipmentType) => equipmentType.id, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'equipment_type_id' })
  equipment_type: EquipmentType;

  @ApiProperty({ description: '설비명', default: '', type: String })
  @Column({ type: 'varchar', default: '', length: 50})
  name: string;
  
  @ApiProperty({ description: '설비코드', default: '', type: String })
  @Column({ type: 'varchar', default: '', length: 50, unique: true})
  code: string;

  @ApiProperty({ description: '창고', default: null, type: Warehouse })
  @ManyToOne(() => Warehouse, (warehouse) => warehouse.id, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'warehouse_id' })
  warehouse: Warehouse;
}