import { Expose, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ShippingSpecificationResponseDto {
  @ApiProperty({ description: '중점 출고 규격 데이터 ID', default: -1, type: Number })
  @Expose({ name: 'id' })
  shippingSpecificationId: number = -1;

  @ApiProperty({ description: '데이터 생성 날짜', default: '', type: Date })
  @Expose({ name: 'create_date' })
  createDate: Date = new Date();

  @ApiProperty({ description: '데이터 변경 날짜', default: '', type: Date })
  @Expose({ name: 'update_date' })
  updateDate: Date = new Date();

  @ApiProperty({ description: '타이어타입', default: '', type: String })
  @Expose({ name: 'standard_type'}) 
  standardType: string = "";

  @ApiProperty({ description: '사용 여부', default: true, type: Boolean })
  @Expose({ name: 'valid_record' })
  validRecord: boolean = true;

  @ApiProperty({ description: '사용자 ID', default: '', type: String })
  @Expose({ name: 'users.id' })
  @Transform(({ obj }) => obj.users?.user_id ?? '')
  usersId: string = '';

  @ApiProperty({ description: '사용자 Seq ID', default: -1, type: Number })  
  @Expose({ name: 'users.seq_id' })
  @Transform(({ obj }) => obj.users?.seq_id ?? -1)
  usersSeqId: number = -1;

  @ApiProperty({ description: '사용자 이름', default: '', type: String })
  @Expose({ name: 'users.name' })
  @Transform(({ obj }) => obj.users?.name ?? '')
  userName: string = '';
}