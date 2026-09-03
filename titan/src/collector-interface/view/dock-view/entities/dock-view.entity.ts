import { ApiProperty } from '@nestjs/swagger';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('dock_view')
export class DockView {
  @ApiProperty({ description: 'Dock ID', default: -1, type: Number })
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ApiProperty({ description: 'Dock 번호', default: -1, type: Number })
  @Column({ type: 'int', default: -1 })
  dock_no: number;

  @ApiProperty({ description: 'Gantry Code', default: -1, type: Number })
  @Column({ type: 'int', default: -1 })
  gantry_code: number;

  @ApiProperty({ description: '출고 상태', default: '', type: String })
  @Column({ type: 'varchar', length: 30, default: '' })
  status: string;

  @ApiProperty({ description: 'ERP 오더 번호', default: -1, type: Number })
  @Column({ type: 'int', default: -1 })
  shipment_order: number;

  @ApiProperty({ description: '컨테이너 번호', default: '', type: String })
  @Column({ type: 'varchar', length: 30, default: '' })
  container_no: string;

  @ApiProperty({ description: '한 오더 내 오더 개수', default: -1, type: Number })
  @Column({ type: 'int', default: -1 })
  unit_order_count: number;

  @ApiProperty({ description: '오더 수량', default: -1, type: Number })
  @Column({ type: 'int', default: -1 })
  order_count: number;

  @ApiProperty({ description: '출고 중 수량', default: -1, type: Number })
  @Column({ type: 'int', default: -1 })
  outing_count: number;

  @ApiProperty({ description: 'Gantry 내 수량', default: -1, type: Number })
  @Column({ type: 'int', default: -1 })
  in_gantry_count: number;

  @ApiProperty({ description: '컨베이어 내 수량', default: -1, type: Number })
  @Column({ type: 'int', default: -1 })
  conveyor_count: number;

  @ApiProperty({ description: '완료 수량', default: -1, type: Number })
  @Column({ type: 'int', default: -1 })
  completion_count: number;

  @ApiProperty({ description: '보류 수량', default: -1, type: Number })
  @Column({ type: 'int', default: -1 })
  remand_count: number;

  @ApiProperty({ description: '불량 수량', default: -1, type: Number })
  @Column({ type: 'int', default: -1 })
  bad_count: number;
}