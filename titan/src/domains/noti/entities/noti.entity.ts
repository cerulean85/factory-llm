import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Users } from 'src/domains/users/users/entities/users.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('noti')
export class Noti {
  @ApiProperty({ description: '공지사항 ID', default: -1, type: Number })
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ApiProperty({ description: '공지사항 제목', default: '', type: String })
  @Column({ type: 'varchar', length: 100, default: '' })
  title: string;

  @ApiProperty({ description: '공지사항 내용', default: '', type: String })
  @Column({ type: 'text', default: '' })
  content: string;

  @ApiProperty({ description: '공지사항 작성 날짜', default: '', type: Date })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  create_date: Date;

  @ApiProperty({ description: '공지사항 수정 날짜', default: '', type: Date })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  update_date: Date;

  @ApiProperty({ description: '공지사항 조회 가능 여부', default: true, type: Boolean })
  @Column({ type: 'boolean', default: true })
  valid_record: boolean;

  @ApiProperty({ description: '공지사항 작성자 (사용자 객체)', default: null, type: Users })
  @ManyToOne(() => Users, (users) => users.seq_id, { nullable: true })
  @JoinColumn({ name: 'users_seq_id' })
  users: Users;
  

}