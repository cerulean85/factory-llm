import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer';
import { IsString, IsOptional, IsInt, IsEnum, IsDate } from 'class-validator';
import { TASK_TYPE, WORKING_STATUS } from 'src/common/enum/equipment.enum';

export class CreateJobHistoryDto {
  @ApiProperty({ name: 'palletId', description: 'pallet ID', default: -1, example: 1, type: Number })
  @Expose({ name: 'palletId' })
  @IsOptional()
  @IsInt()
  pallet_id: number;

  @ApiProperty({ name: 'warehouseId', description: 'warehouse ID', default: -1, example: 1, type: Number })
  @Expose({ name: 'warehouseId' })
  @IsOptional()
  @IsInt()
  warehouse_id: number;

  @ApiProperty({ name: 'skuKey', description: 'sku_key', default: '', type: String })
  @Expose({ name: 'skuKey' })
  @IsOptional()
  @IsString()
  sku_key: string;

  @ApiProperty({ description: '품목 이름', default: '', type: String, required: false })
  @Expose({ name: 'standardType' })
  @IsOptional()
  @IsString()
  standard_type: string;

  @ApiProperty({ description: '작업 상태', default: WORKING_STATUS.COMPLETE, enum: WORKING_STATUS, required: false })
  @Expose({ name: 'workingStatus' })
  @IsOptional()
  @IsEnum(WORKING_STATUS)
  working_status: WORKING_STATUS;

  @ApiProperty({ name: 'stCount', description: '품목 수량', default: -1, example: 1, type: Number })
  @Expose({ name: 'stCount' })
  @IsOptional()
  @IsInt()
  st_count: number;

  @ApiProperty({ name: 'locRaw', description: '위치 정보', default: '', example: '1-1-1', type: String })
  @Expose({ name: 'locRaw' })
  @IsOptional()
  @IsString()
  loc_raw: string;

  @ApiProperty({ description: '입고, 출고, 이동', default: TASK_TYPE.NONE, enum: TASK_TYPE, required: false })
  @Expose({ name: 'taskType' })
  @IsOptional()
  @IsEnum(TASK_TYPE)
  task_type: TASK_TYPE;

  @ApiProperty({ description: '배치 번호', default: '', type: String, required: false })
  @Expose({ name: 'batchNumber' })
  @IsOptional()
  @IsString()
  batch_number: string;

  @ApiProperty({ name: 'orderNumber', description: '오더 번호', default: '', example: '1', type: String })
  @Expose({ name: 'orderNumber' })
  @IsOptional()
  @IsString()
  order_number: string;

  @ApiProperty({ name: 'orderFlow', description: '오더 순서', default: '', example: '1', type: String })
  @Expose({ name: 'orderFlow' })
  @IsOptional()
  @IsString()
  order_flow: string;

  @ApiProperty({ name: 'jobDate', description: '작업 일자', default: '', example: new Date(), type: Date })
  @Expose({ name: 'jobDate' })
  @IsOptional()
  @IsDate()
  job_date: Date;
}