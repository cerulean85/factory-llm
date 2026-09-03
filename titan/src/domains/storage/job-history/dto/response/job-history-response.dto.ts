import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';

export class JobHistoryResponseDto {
  @ApiProperty({ description: 'job 내역 ID', example: 1, default: -1, type: Number })
  @Expose()
  id: number;

  @ApiProperty({ description: '팔레트 ID', example: 'rfid8372', default: -1, type: Number })
  @Expose({ name: 'pallet_id' })
  @Transform(({ obj }) => obj?.pallet?.id ?? null, { toClassOnly: true })
  palletId: number | null = null;

  @ApiProperty({ description: '창고 Id', example: '1', default: '', type: Number })
  @Expose({ name: 'equipment_id' })
  @Transform(({ obj }) => obj.warehouse.id)
  warehouseId: number;

  @ApiProperty({ description: '아이템 키', example: '1', default: '', type: String })
  @Expose({ name: 'sku_key' })
  skuKey: string;

  @ApiProperty({ description: '작업 상태', example: '작업 중', default: '', type: String })
  @Expose({ name: 'working_status' })
  workingStatus: string;

  @ApiProperty({ description: '품목 수량', example: '1', default: '', type: Number })
  @Expose({ name: 'st_count' })
  stCount: number;

  @ApiProperty({ description: '위치 정보', example: '1-1-1', default: '', type: String })
  @Expose({ name: 'loc_raw' })
  locRaw: string;

  @ApiProperty({ description: '입고, 출고, 이동', example: '입고', default: '', type: String })
  @Expose({ name: 'task_type' })
  taskType: string;

  @ApiProperty({ description: '생성 날짜', example: new Date(), default: '', type: Date })
  @Expose({name: 'create_date'})
  createDate: Date;
}