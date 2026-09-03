import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Users } from 'src/domains/users/users/entities/users.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('shipping_specification')
export class ShippingSpecification {
  @ApiProperty({ description: '중점 출고 규격 ID', default: -1, type: Number })
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ApiProperty({ description: '사용자 생성 날짜', default: '', type: Date })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  create_date: Date;

  @ApiProperty({ description: '정보 수정 날짜', default: '', type: Date })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  update_date: Date;

  @ApiProperty({ description: '규격 사용 여부', default: true, type: Boolean })
  @Column({ type: 'boolean', default: true })
  valid_record: boolean = true;

  @ApiProperty({ description: '타이어 규격 종류', default: '', type: String })
  @Column({ type: 'varchar', length: 100, default : '' })
  standard_type: string;

  @ApiProperty({ description: '(사용자 객체)', default: null, type: Users })
  @ManyToOne(() => Users, (users) => users.seq_id, { nullable: true })
  @JoinColumn({ name: 'users_seq_id' })
  users: Users;
}