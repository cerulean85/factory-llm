import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Users } from 'src/domains/users/users/entities/users.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('setting_remote')
export class Remote {
  @ApiProperty({ description: '원격 ID', default: -1, type: Number })
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ApiProperty({ description: '사용자 생성 날짜', default: new Date(), type: Date })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  create_date: Date;

  @ApiProperty({ description: '정보 수정 날짜', default: new Date(), type: Date })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  update_date: Date;

  @ApiProperty({ description: '사용 여부', default: true, type: Boolean })
  @Column({ type: 'boolean', default: true })
  valid_record: boolean;

  @ApiProperty({ description: '원격 위치 정보', default: '', type: String })
  @Column({ type: 'varchar', length: 50, default: '' })
  location: string;

  @ApiProperty({ description: '원격 IP', default: '', type: String })
  @Column({ type: 'varchar', length: 20, default: '' })
  ip: string;

  @ApiProperty({ description: '원격 포트', default: 1, type: Number })
  @Column({ type: 'int', default: 1 })
  port: number;

  @ApiProperty({ description: '사용자', default: '', type: String })
  @ManyToOne(() => Users, (users) => users.seq_id, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'seq_id' })
  users: Users;
}