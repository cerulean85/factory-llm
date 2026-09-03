import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { EQUIPMENT_TYPE } from 'src/common/enum/equipment.enum';

@Index('idx_equipment_type_id', ['id'])
@Entity('equipment_type')
export class EquipmentType {
  @ApiProperty({ description: '설비 타입 ID', default: -1, type: Number })
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ApiProperty({ description: '사용자 생성 날짜', default: new Date(), type: Date })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  create_date: Date;

  @ApiProperty({ description: '설비명', default: '', type: String })
  @Column({ type: 'varchar', default: '', length: 50})
  name: string;

  @ApiProperty({ description: '설명', default: '', type: String })
  @Column({ type: 'varchar', default: '', length: 500})
  description: string;

  @ApiProperty({ description: '사용 가능 여부', default: true, type: Boolean })
  @Column({ type: 'boolean', default: true })
  valid_record: boolean;

  @ApiProperty({ description: '설비 타입', default: EQUIPMENT_TYPE.CNV, enum: EQUIPMENT_TYPE })
  @Column({ type: 'varchar', default: EQUIPMENT_TYPE.CNV, length: 50})
  type: EQUIPMENT_TYPE;

}