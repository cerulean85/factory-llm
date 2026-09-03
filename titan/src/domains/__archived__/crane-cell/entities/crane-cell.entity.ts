import { ApiProperty } from '@nestjs/swagger';
import { CELL_STATUS } from 'src/common/enum/cell.enum';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Equipment } from 'src/domains/equipment/equipment/entities/equipment.entity';

@Entity('crane_cell')
export class CraneCell {
  @ApiProperty({ description: 'ID', default: -1, type: Number })
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ApiProperty({ description: 'Bank 정보', default: '2', type: Number })
  @Column({ type: 'int', default: 2 })
  bank: number;

  @ApiProperty({ description: 'Bay 정보', default: '4', type: Number })
  @Column({ type: 'int', default: 4 })
  bay: number;

  @ApiProperty({ description: 'Level 정보', default: '4', type: Number })
  @Column({ type: 'int', default: 4 })
  level: number;

  @ApiProperty({ description: '사용 여부', default: true, type: Boolean })
  @Column({ type: 'boolean', default: true })
  enable: boolean;

  @ApiProperty({ description: 'Cell 상태', default: CELL_STATUS.NORMAL, enum: CELL_STATUS })
  @Column({ type: 'enum', enum: CELL_STATUS, default: CELL_STATUS.NORMAL })
  cell_status: CELL_STATUS;

  @ApiProperty({ description: '정보 생성 날짜', default:  new Date().toISOString(), type: Date })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  create_date: Date;

  @ApiProperty({ description: '정보 수정 날짜', default:  new Date().toISOString(), type: Date })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  update_date: Date;

  @ApiProperty({ description: '설비', default: null, type: Equipment })
  @ManyToOne(() => Equipment, (equipment) => equipment.id)
  @JoinColumn({ name: 'equipment_id' })
  equipment: Equipment;
}