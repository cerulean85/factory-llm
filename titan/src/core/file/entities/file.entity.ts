import { Entity, PrimaryGeneratedColumn, Column} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('file')
export class FileDto {
  @ApiProperty({ description: '파일 ID', default: -1, type: Number })
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ApiProperty({ description: '파일 업로드 날짜', default: new Date(), type: Date })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  create_date: Date;

  @ApiProperty({ description: '파일 수정 날짜', default: new Date(), type: Date })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  update_date: Date;

  @ApiProperty({ description: '파일 이름', default: '', type: String })
  @Column({ type: 'text', default: ''})
  name: string;

  @ApiProperty({ description: '실제 저장된 파일 이름', default: '', type: String })
  @Column({ type: 'text', default: ''})
  stored_name: string;

  @ApiProperty({ description: '파일 저장 경로', default: '', type: String })
  @Column({ type: 'text', default: ''})
  path: string;
}