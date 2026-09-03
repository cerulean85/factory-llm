import { ApiProperty } from '@nestjs/swagger';
import { CELL_STATUS } from 'src/common/enum/cell.enum';
import { Equipment } from 'src/domains/equipment/equipment/entities/equipment.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
@Entity('gantry_cell')
export class GantryCell {
  @ApiProperty({ description: 'Gantry ID', default: -1, type: Number })
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ApiProperty({ description: 'Gantry port', default: 1, type: Number })
  @Column({ type: 'int'})
  port: number;
  
  @ApiProperty({ description: 'Gantry row', default: 1, type: Number })
  @Column({ type: 'int' })
  bank: number;
  
  @ApiProperty({ description: 'Gantry column', default: 1, type: Number })
  @Column({ type: 'int' })
  bay: number;

  @ApiProperty({ description: '사용 내역', default: true, type: Boolean})
  @Column({ type: 'boolean', default: true })
  enable: boolean;

  @ApiProperty({ description: 'Cell 상태', default: CELL_STATUS.NORMAL, enum: CELL_STATUS })
  @Column({ type: 'enum', enum: CELL_STATUS, default: CELL_STATUS.NORMAL })
  cell_status: CELL_STATUS;

  @ApiProperty({ description: '내역 생성 날짜', default: '', type: Date })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  create_date: Date;

  @ApiProperty({ description: '내역 수정 날짜', default: '', type: Date })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  update_date: Date;

  @ManyToOne(() => Equipment, (equipment) => equipment.id)
  @JoinColumn({ name: 'equipment_id' })
  equipment: Equipment;
}