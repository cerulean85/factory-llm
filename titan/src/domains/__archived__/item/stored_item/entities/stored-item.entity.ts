import { ApiProperty } from '@nestjs/swagger';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('stored_item')
export class StoredItem {
  @ApiProperty({ description: 'StoredItem ID', default: -1, type: Number })
  @PrimaryGeneratedColumn('increment')
  id: number;
  
  @ApiProperty({ description: '타이어 규격', default: '', type: String })
  @Column({ type: 'varchar', length: 100, default: '' })
  standard_type: string;

  @ApiProperty({ description: '상세내용', default: '', type: String, required: false })
  @Column({ type: 'varchar', length: 200, default: '',  nullable: true })
  detail: string;

  @ApiProperty({ description: '내역 생성 날짜', default: '', type: Date })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  create_date: Date;

  @ApiProperty({ description: '내역 수정 날짜', default: '', type: Date })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  update_date: Date;

  @ApiProperty({ description: '적재 아이템 고유 번호', default: '', type: String })
  @Column({ type: 'varchar', length: 50, default: '' })
  sku_id: string;
}