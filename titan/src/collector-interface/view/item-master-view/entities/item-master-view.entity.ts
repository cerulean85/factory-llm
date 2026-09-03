import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('item_master_view')
export class ItemMasterView {
  @ApiProperty({ description: 'sku_key', default: '', type: String })
  @PrimaryColumn({ type: 'varchar', length: 20, unique: true })
  sku_key: string;

  @ApiProperty({ description: '타이어 규격', default: '', type: String })
  @Column({ type: 'varchar', length: 100 })
  standard_type: string;
}