import { Entity, PrimaryGeneratedColumn, Column, OneToMany, BeforeInsert, Index } from 'typeorm';
import { LoginHistory } from '../../login-history/entities/login-history.entity';
import * as bcryptjs from 'bcryptjs';
import { HASH_SALT } from '../../../../config/auth.config';
import { ApiProperty } from '@nestjs/swagger';

@Index('idx_users_seq_id', ['seq_id'])
@Entity('users')
export class Users {
  @ApiProperty({ description: '사용자 Seq ID', default: -1, type: Number })
  @PrimaryGeneratedColumn('increment')
  seq_id: number;

  @ApiProperty({ description: '사용자 ID', default: '', type: String })
  @Column({ type: 'varchar', length: 30})
  user_id: string;

  @ApiProperty({ description: '사용자 비밀번호', default: '', type: String })
  @Column({ type: 'varchar'})
  password: string;

  @ApiProperty({ description: '사용자 이메일', default: '', type: String })
  @Column({ type: 'varchar', length: 50, default: '' })
  email: string;

  @ApiProperty({ description: '사용자 이름', default: '', type: String })
  @Column({ type: 'varchar', length: 30 })
  name: string;

  @ApiProperty({ description: '사용자 소속', default: '', type: String })
  @Column({ type: 'varchar', length: 50, default: '' })
  affiliation: string;

  @ApiProperty({ description: '사용자 전화번호', default: '', type: String })
  @Column({ type: 'varchar', length: 20, default: '' })
  phone_number: string;

  @ApiProperty({ description: '사용자 생성 날짜', default: '', type: Date })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  create_date: Date;

  @ApiProperty({ description: '사용자 수정 날짜', default: '', type: Date })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  update_date: Date;

  @ApiProperty({ description: '사용자 접속 가능 여부', default: true, type: Boolean })
  @Column({ type: 'boolean', default: true })
  valid_record: boolean = true;

  @ApiProperty({ description: '사용자 차단 여부', default: false, type: Boolean })
  @Column({ type: 'boolean', default: false })
  blocking: boolean;

  @ApiProperty({ description: '사용자 로그인 이력', default: [], type: () => [LoginHistory] })
  @OneToMany(() => LoginHistory, (loginHistory) => loginHistory.users)
  loginHistories: LoginHistory[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcryptjs.hash(this.password, HASH_SALT);
  }
}