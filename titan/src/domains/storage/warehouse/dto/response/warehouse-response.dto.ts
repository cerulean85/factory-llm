import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { WAREHOUSE_TYPE } from 'src/common/enum/equipment.enum';

export class WarehouseResponseDto {
  @ApiProperty({ description: '창고 ID', example: 1, default: -1, type: Number })
  @Expose()
  id: number = -1;

  @ApiProperty({ description: '정보 생성 날짜', example: new Date(), default: '', type: Date })
  @Expose({name: 'create_date'})
  createDate: Date = new Date();

  @ApiProperty({ description: '정보 수정 날짜', example: new Date(), default: '', type: Date })
  @Expose({name: 'update_date'})
  updateDate: Date = new Date();

  @ApiProperty({ description: '사용 여부', example: true, default: true, type: Boolean })
  @Expose({name: 'valid_record'})
  validRecord: boolean = true;

  @ApiProperty({ description: '창고 타입', example: WAREHOUSE_TYPE.ETC, default: WAREHOUSE_TYPE.ETC, enum: WAREHOUSE_TYPE })
  @Expose()
  type: WAREHOUSE_TYPE = WAREHOUSE_TYPE.ETC;

  @ApiProperty({ description: '창고 코드', example: '', default: '', type: String })
  @Expose()
  code: string = '';

  @ApiProperty({ description: '창고 이름', example: '', default: '', type: String })
  @Expose()
  name: string = '';
}
