import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Users } from '../../../../domains/users/users/entities/users.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('refresh-token')
export class RefreshToken {
  @ApiProperty({ description: 'refresh token ID', default: -1, type: Number })
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ApiProperty({ description: 'refresh token', default: '', type: String })
  @Column({ default: null, nullable: true })
  refresh_token: string;

  @ApiProperty({ description: '사용자 생성 날짜', default: new Date(), type: Date })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  create_date: Date;

  @ApiProperty({ description: '만료 날짜', default: new Date(), type: Date })
  @Column({default: () => 'CURRENT_TIMESTAMP'})
  expires_date: Date;

  @ApiProperty({ description: '사용자', default: new Users(), type: Users })
  @ManyToOne(() => Users, (users) => users.seq_id, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'user_seq_id' })
  users: Users;
}