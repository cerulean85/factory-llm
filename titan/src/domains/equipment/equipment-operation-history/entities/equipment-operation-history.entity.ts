import { ApiProperty } from '@nestjs/swagger';
import { OPERATION_MAINTENANCE_TYPE, OPERATION_STATUS } from 'src/common/enum/equipment.enum';
import { Equipment } from 'src/domains/equipment/equipment/entities/equipment.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Index } from 'typeorm';

@Index('idx_equipment_id', ['equipment'])
@Index('idx_create_date', ['create_date'])
@Index('idx_equipment_create_date', ['equipment', 'create_date'])  // 복합 인덱스
@Entity('equipment_operation_history')
export class EquipmentOperationHistory {
  @ApiProperty({ description: '설비 가동 이력 ID', default: -1, type: Number })
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ApiProperty({ description: '설비', default: null, type: Equipment })
  @ManyToOne(() => Equipment, (equipment) => equipment.id)
  @JoinColumn({ name: 'equipment_id' })
  equipment: Equipment;

  @ApiProperty({ description: '내역 생성 날짜', default: '', type: Date })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  create_date: Date;
  
  @ApiProperty({ description: '가동 상태', default: OPERATION_STATUS.UNKNOWN, enum: OPERATION_STATUS })
  @Column({ type: 'varchar', length: 20 })
  operation_status: OPERATION_STATUS | number;

  @ApiProperty({ description: '가동 보수 유형', default: OPERATION_MAINTENANCE_TYPE.DEFAULT, enum: OPERATION_MAINTENANCE_TYPE })
  @Column({ type: 'varchar', length: 20 } )
  operation_maintenance_type: OPERATION_MAINTENANCE_TYPE = OPERATION_MAINTENANCE_TYPE.DEFAULT;

  @ApiProperty({ description: '상세 내역', default: '', type: String })
  @Column({ type: 'varchar', length: 500 })
  description: string = '';
}