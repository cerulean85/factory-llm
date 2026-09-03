import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Users } from 'src/domains/users/users/entities/users.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('todo')
export class Todo {
  @ApiProperty({ description: 'todo ID', default: -1, type: Number })
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ApiProperty({ description: '타이어 규격', default: '', type: String })
  @Column({ type: 'varchar', length: 100, default: '' })
  standard_type: string;

  @ApiProperty({ description: '목표 시작일', default:  new Date(), type: Date })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  target_start_date: Date;

  @ApiProperty({ description: '목표일', default:  new Date(), type: Date })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  target_end_date: Date;

  @ApiProperty({ description: '목표량', default: '0', type: Number })
  @Column({ type: 'int', default: 0 })
  target_count: number;

  @ApiProperty({ description: '내용', default: '', type: String })
  @Column({ type: 'text', default: ''})
  description: string = '';

  @ApiProperty({ description: '생성 날짜', default:  new Date(), type: Date })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  create_date: Date;

  @ApiProperty({ description: '수정 날짜', default:  new Date(), type: Date })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  update_date: Date;

  @ApiProperty({ description: 'soft 삭제여부', default: true, type: Boolean })
  @Column({ type: 'boolean', default: true })
  valid_record: boolean;

  @ApiProperty({ description: '알람 발생 시간', default: 1, type: Number })
  @Column({ type: 'int', default: 1 })
  alarm_offset_hours: number;

  @ApiProperty({ description: '알람 전송 여부', default: false, type: Boolean })
  @Column({ type: 'boolean', default: false })
  alarm_process_flag: boolean;

  @ApiProperty({ description: '작성자 (사용자 객체)', default: null, type: Users })
  @ManyToOne(() => Users, (users) => users.seq_id, { nullable: true })
  @JoinColumn({ name: 'users_seq_id' })
  users: Users;
  

}