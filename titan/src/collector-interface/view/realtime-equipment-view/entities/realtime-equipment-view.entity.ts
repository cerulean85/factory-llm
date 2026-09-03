import { ApiProperty } from '@nestjs/swagger';
import { ACTION_TYPE, OPERATION_STATUS, TASK_TYPE, TWIN_STATUS } from 'src/common/enum/equipment.enum';
import { Equipment } from 'src/domains/equipment/equipment/entities/equipment.entity';
import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne, OneToOne } from 'typeorm';

@Entity('realtime_equipment_view')
export class RealtimeEquipmentView {
  @ApiProperty({ description: 'Realtime Equipment View ID', default: -1, type: Number })
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ApiProperty({ description: '장비', default: new Equipment(), type: Equipment })
  @OneToOne(() => Equipment, (equipment) => equipment.id)
  @JoinColumn({ name: 'equipment_id' })
  equipment: Equipment;

  @ApiProperty({ description: '현재 속도', default: -1, type: Number })
  @Column({ type: 'int', default: -1, nullable: true  })
  speed: number | null;

  @ApiProperty({ description: '현재 상태', default: OPERATION_STATUS.UNKNOWN, enum: OPERATION_STATUS})
  @Column({ type: 'varchar', length: 20, default: '', nullable: true })
  status: OPERATION_STATUS | number | null;

  @ApiProperty({ description: '위치 정보_bay', default: 0, type: Number })
  @Column({ type: 'int', default: 0, nullable: true })
  loc_x: number | null;

  @ApiProperty({ description: '위치 정보_bank', default: 0, type: Number })
  @Column({ type: 'int', default: 0, nullable: true })
  loc_y: number | null;

  @ApiProperty({ description: '위치 정보_level', default: 0, type: Number })
  @Column({ type: 'int', default: 0, nullable: true })
  loc_z: number | null;

  @ApiProperty({ description: '가동 유형', default: TASK_TYPE.NONE, enum: TASK_TYPE})
  @Column({type: 'varchar', length: 20, nullable: true})
  task_type: TASK_TYPE | null;

  @ApiProperty({ description: '타이어 규격', default: '', type: String})
  @Column({type: 'varchar', length: 100, nullable: true})
  standard_type: string | null;

  @ApiProperty({ description: '타이어 개수', default: 0, type: Number})
  @Column({type: 'int', default: 0, nullable: true})
  st_count: number | null = 0;

  @ApiProperty({ description: '생성 날짜', default: new Date(), type: Date })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  create_date: Date;

  @ApiProperty({ description: 'TWIN 포크 위치', default: TWIN_STATUS.DEFAULT, enum: TWIN_STATUS})
  @Column({type: 'varchar', length: 20, default: TWIN_STATUS.DEFAULT, nullable: true})
  twin_status: TWIN_STATUS | null;

  @ApiProperty({ description: '팔레트 적재 여부', default: false, type: Boolean })
  @Column({ type: 'boolean', default: false, nullable: true })
  loaded: boolean | null;

  @ApiProperty({ description: '작업 유형', default: ACTION_TYPE.NONE, enum: ACTION_TYPE })
  @Column({ type: 'varchar', length: 30, default: ACTION_TYPE.NONE, nullable: true })
  action_type: ACTION_TYPE | null;
}