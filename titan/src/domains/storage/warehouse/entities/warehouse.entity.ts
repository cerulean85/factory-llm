import { ApiProperty } from '@nestjs/swagger';
import { WAREHOUSE_TYPE } from 'src/common/enum/equipment.enum';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
@Entity('warehouse')
export class Warehouse {
  @ApiProperty({ description: '창고 ID', default: -1, type: Number })
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ApiProperty({ description: '정보 생성 날짜', default: '', type: Date })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  create_date: Date;

  @ApiProperty({ description: '정보 수정 날짜', default: '', type: Date })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  update_date: Date;

  @ApiProperty({ description: '사용 여부', default: true, type: Boolean })
  @Column({ type: 'boolean', default: true })
  valid_record: boolean = true;

  @ApiProperty({ description: '창고 타입', default: WAREHOUSE_TYPE.ETC, enum: WAREHOUSE_TYPE })
  @Column({ enum: WAREHOUSE_TYPE, default: WAREHOUSE_TYPE.ETC })
  type: WAREHOUSE_TYPE = WAREHOUSE_TYPE.ETC;

  @ApiProperty({ description: '창고 코드', default: '', type: String })
  @Column({ type: 'varchar', length: 50, default: '' })
  code: string;

  @ApiProperty({ description: '창고 이름', default: '', type: String })
  @Column({ type: 'varchar', length: 50, default: '' })
  name: string;
}