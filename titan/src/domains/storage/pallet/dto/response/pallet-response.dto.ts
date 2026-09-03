import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class PalletResponseDto {
  @ApiProperty({ description: '팔레트 ID', example: 1, default: -1, type: Number })
  @Expose()
  id: number;

  @ApiProperty({ description: '팔레트 코드', example: 'rfid8372', default: '', type: Number })
  @Expose()
  code: string;

  @ApiProperty({ description: '정보 생성 날짜', example: new Date(), default: '', type: Date })
  @Expose({name: 'create_date'})
  createDate: Date;

  @ApiProperty({ description: '정보 수정 날짜', example: new Date(), default: '', type: Date })
  @Expose({name: 'update_date'})
  updateDate: Date;
}
