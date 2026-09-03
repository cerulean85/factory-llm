import { Expose, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { EQUIPMENT_TYPE } from 'src/common/enum/equipment.enum';

export class EquipmentTypeResponseDto {
  @ApiProperty({ description: '장비 유형 번호', default: -1, type: Number })
  @Expose({ name: 'id' })
  id: number = -1;
  
  @ApiProperty({ description: '장비 유형 생성일자', default: new Date(), type: Date })
  createDate: Date = new Date();

  @ApiProperty({ description: '장비 유형명', default: '', type: String })
  @Expose()
  name: string = "";

  @ApiProperty({ description: '장비 설명', default: '', type: String })
  @Expose()
  description: string = "";

  @ApiProperty({ description: '장비 유형', default: EQUIPMENT_TYPE.CNV, enum: EQUIPMENT_TYPE })
  @Expose()
  type: EQUIPMENT_TYPE = EQUIPMENT_TYPE.CNV;
}