import { ApiProperty } from '@nestjs/swagger';
import { OPERATION_MAINTENANCE_TYPE } from 'src/common/enum/equipment.enum';
import { Equipment } from 'src/domains/equipment/equipment/entities/equipment.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity('equipment_operation_maintenance')
export class EquipmentOperationMaintenance {
  @ApiProperty({ description: '설비 가동 보수 이력 ID', default: -1, type: Number })
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ApiProperty({ description: '설비', default: null, type: Equipment })
  @ManyToOne(() => Equipment, (equipment) => equipment.id)
  @JoinColumn({ name: 'equipment_id' })
  equipment: Equipment;

  @ApiProperty({ description: '내역 시작 날짜', default: new Date(), type: Date })
  @Column({ type: 'timestamp'})
  start_date: Date;

  @ApiProperty({ description: '내역 종료 날짜', default: new Date(), type: Date })
  @Column({ type: 'timestamp'})
  end_date: Date;
  
  @ApiProperty({ description: '내역 생성 날짜', default: '', type: Date })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  create_date: Date;

  @ApiProperty({ description: '가동 보수 유형', default: OPERATION_MAINTENANCE_TYPE.DEFAULT, enum: OPERATION_MAINTENANCE_TYPE })
  @Column({ type: 'varchar', length: 20 } )
  operation_maintenance_type: OPERATION_MAINTENANCE_TYPE = OPERATION_MAINTENANCE_TYPE.DEFAULT;

  @ApiProperty({ description: '상세 내역', default: '', type: String })
  @Column({ type: 'varchar', length: 500 })
  description: string = '';
}