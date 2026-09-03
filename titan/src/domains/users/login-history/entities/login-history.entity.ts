import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Users } from '../../users/entities/users.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('login_history')
export class LoginHistory {
  @ApiProperty({ description: '로그인 이력 ID', default: '', type: Number })
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ApiProperty({ description: '로그인 IP', default: '', type: String })
  @Column({ type: 'varchar', default: '', length: 30 })
  try_ip: string;

  @ApiProperty({ description: '로그인 날짜', default: '', type: Date })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  create_date: Date;

  @ApiProperty({ description: '사용자 객체', default: '', type: Users })
  @ManyToOne(() => Users, (users) => users.seq_id, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'users_seq_id' })
  users: Users;
} 