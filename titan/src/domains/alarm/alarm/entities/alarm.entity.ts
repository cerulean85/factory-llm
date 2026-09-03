import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, Index} from 'typeorm';
import { EquipmentType } from 'src/domains/equipment/equipment-type/entities/equipment-type.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Users } from 'src/domains/users/users/entities/users.entity';
import { ALARM_HISTORY_TYPE } from 'src/common/enum/alarm.enum';

@Index('idx_alarm_id_equipment_type_id', ['id', 'equipment_type'])
@Entity('alarm')
export class Alarm {
  @ApiProperty({ description: '알람 ID', default: -1, type: Number })
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ApiProperty({ description: '알람 코드', default: '', type: String })
  @Column({ type: 'varchar', length: 50, default: '' })
  code: string;

  @ApiProperty({ description: '알람 타입', default: ALARM_HISTORY_TYPE.EQUIPMENT, enum: ALARM_HISTORY_TYPE })
  @Column({ type: 'varchar', length: 50, default: ALARM_HISTORY_TYPE.EQUIPMENT })
  type: ALARM_HISTORY_TYPE = ALARM_HISTORY_TYPE.EQUIPMENT;

  @ApiProperty({ description: '설명', default: '', type: String })
  @Column({ type: 'varchar', length: 500, default: '' })
  description: string;

  @ApiProperty({ description: '중요도', default: 1, type: Number })
  @Column({ type: 'int', default: 1 })
  importance: number;

  @ApiProperty({ description: '데이터 생성 날짜', default: new Date(), type: Date })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  create_date: Date;

  @ApiProperty({ description: '데이터 업데이트 날짜', default: new Date(), type: Date })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  update_date: Date;

  @ApiProperty({ description: '조치 방법', default: '', type: String })
  @Column({ type: 'varchar', length: 500, default: '' })
  process_method: string;

  @ApiProperty({ description: '매뉴얼 파일 ID', default: [], type: [String] })
  @Column({ type: 'int', array: true, default: [], nullable: true })
  file_id_list: number[];

  @ApiProperty({ description: '사용 가능 여부', default: true, type: Boolean })
  @Column({ type: 'boolean', default: true })
  valid_record: boolean;

  @ApiProperty({ description: '알람 전송 여부', default: false, type: Boolean })
  @Column({ type: 'boolean', default: false })
  send_enabled: boolean;
  
  @ApiProperty({ description: '리셋 기능 가능 여부', default: false, type: Boolean })
  @Column({ type: 'boolean', default: false })
  reset_available: boolean = false;

  @ApiProperty({ description: '장비 타입', default: new EquipmentType(), type: EquipmentType })
  @ManyToOne(() => EquipmentType, (equipmentType) => equipmentType.id)
  @JoinColumn({ name: 'equipment_type_id' })
  equipment_type: EquipmentType;

  manager_user_list?: Users[];

  //user_list?: any[];  //사실상 없어도 무방하지만 repository의 leftJoinAndMapMany()에 의해 user_list가 강제로 생기기 때문에, 명시적으로 변수를 생성해줌
}