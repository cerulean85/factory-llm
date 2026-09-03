import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Users } from '../../users/entities/users.entity'
import { ApiProperty } from '@nestjs/swagger';
import { ROLE_TYPE } from 'src/common/enum/users.enum';

@Entity('role')
export class Role {
  @ApiProperty({ description: '권한 ID', default: -1, type: Number })
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ApiProperty({ description: '권한 유형', default: ROLE_TYPE.DEFAULT, enum: ROLE_TYPE })
  @Column({ type: 'varchar', length: 20, default: ROLE_TYPE.DEFAULT  })
  type: ROLE_TYPE = ROLE_TYPE.DEFAULT;

  @ApiProperty({ description: '권한 생성 날짜', default: new Date(), type: Date })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  create_date: Date;

  @ApiProperty({ description: '권한 수정 날짜', default: new Date(), type: Date })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  update_date: Date;

  @ApiProperty({ description: '권한 유효 여부', default: true, type: Boolean })
  @Column({ type: 'boolean', default: true })
  valid_record: boolean;

  @ApiProperty({ description: '권한 설명', default: '', type: String })
  @Column({ type: 'varchar', length: 500, default: '' })
  description: string;
  
  @ApiProperty({ description: '사용자', default: null, type: Users })
  @ManyToOne(() => Users, (users) => users.seq_id, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'user_seq_id' })
  users: Users;
}