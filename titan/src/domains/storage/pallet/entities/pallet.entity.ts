import { ApiProperty } from '@nestjs/swagger';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('pallet')
export class Pallet {
  @ApiProperty({ description: 'Pallet ID', default: -1, type: Number })
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ApiProperty({ description: '내역 생성 날짜', default: '', type: Date })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  create_date: Date;

  @ApiProperty({ description: '내역 수정 날짜', default: '', type: Date })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  update_date: Date;

  @ApiProperty({ description: 'Pallet Code', example: 'RFID1234567890' })
  @Column({ type: 'varchar', length: 50, unique: true })
  code: string;
}