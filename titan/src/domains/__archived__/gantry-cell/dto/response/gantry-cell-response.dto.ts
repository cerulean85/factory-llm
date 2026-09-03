import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { CELL_STATUS } from 'src/common/enum/cell.enum';

export class GantryCellResponseDto {
  @ApiProperty({ description: 'Gantry 셀 ID', example: 1, default: -1, type: Number })
  @Expose()
  id: number;

  @ApiProperty({ description: 'bank 정보', example: '2', default: true, type: Number })
  @Expose()
  bank: number;

  @ApiProperty({ description: 'bay 정보', example: '3', default: true, type: Number })
  @Expose()
  bay: number;
  
  @ApiProperty({ description: 'port 정보', example: '4', default: true, type: Number })
  @Expose()
  port: number;

  @ApiProperty({ description: '사용 여부', example: true, default: true, type: Boolean })
  @Expose()
  enable: boolean = true;

  @ApiProperty({ description: 'Cell 상태', default: CELL_STATUS.NORMAL, enum: CELL_STATUS })
  @Expose({ name: 'cell_status' })
  cellStatus: CELL_STATUS;

  @ApiProperty({ description: '정보 생성 날짜', example: new Date(), default: '', type: Date })
  @Expose({name: 'create_date'})
  createDate: Date;

  @ApiProperty({ description: '정보 수정 날짜', example: new Date(), default: '', type: Date })
  @Expose({name: 'update_date'})
  updateDate: Date;

  @ApiProperty({ description: '설비 ID', default: -1, type: Number })
  @Expose({ name: 'equipment' })
  @Transform(({ obj }) => obj.equipment?.id)
  equipmentId: number;

  @ApiProperty({ description: '설비 코드', default: '', type: String })
  @Expose({ name: 'equipment' })
  @Transform(({ obj }) => obj.equipment?.code)
  equipmentCode: string;
}
