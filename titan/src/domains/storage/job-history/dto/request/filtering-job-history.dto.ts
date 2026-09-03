import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { DateTransform } from "src/common/decorator/date-transform.decorator";
import { EQUIPMENT_TYPE, TASK_TYPE, WAREHOUSE_TYPE, WORKING_STATUS } from "src/common/enum/equipment.enum";

export class FilteringJobHistoryDto {
  @ApiProperty({ description: 'job 내역 ID', default: -1, type: Number, required: false })
  @IsOptional()
  @IsNumber()
  jobHistoryId: number;

  @ApiProperty({ description: 'pallet ID', default: -1, type: Number, required: false })
  @IsOptional()
  @IsNumber()
  palletId: number;

  @ApiProperty({ description: 'warehouse ID', default: -1, type: Number, required: false })
  @IsOptional()
  @IsNumber()
  warehouseId: number;

  @ApiProperty({ description: 'sku_key', default: '', type: String, required: false })
  @IsOptional()
  @IsString()
  skuKey: string;

  @ApiProperty({ description: '품목 이름', default: '', type: String, required: false })
  @IsOptional()
  @IsString()
  standardType: string;

  @ApiProperty({ description: '품목 이름 리스트', default: [], type: [String], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  standardTypes: string[];

  @ApiProperty({ description: '작업 상태', default: WORKING_STATUS.COMPLETE, enum: WORKING_STATUS, required: false })
  @IsOptional()
  @IsEnum(WORKING_STATUS)
  workingStatus: WORKING_STATUS;  

  @ApiProperty({ description: '입고, 출고, 이동', default: TASK_TYPE.NONE, enum: TASK_TYPE, required: false })
  @IsOptional()
  @IsEnum(TASK_TYPE)
  taskType: TASK_TYPE;

  @ApiProperty({ description: '배치 번호', default: '', type: String, required: false })
  @IsOptional()
  @IsString()
  batchNumber: string;

  @ApiProperty({ description: '오더 번호', default: '', type: String, required: false })
  @IsOptional()
  @IsString()
  orderNumber: string;

  @ApiProperty({ description: '조회 시작 날짜', default: '', type: Date, required: false })
  @IsOptional()
  @DateTransform()
  jobStartDate: Date;

  @ApiProperty({ description: '조회 끝 날짜', default: '', type: Date, required: false })
  @IsOptional()
  @DateTransform()
  jobEndDate: Date;

  @ApiProperty({ description: '창고타입', default: WAREHOUSE_TYPE.ETC, enum: WAREHOUSE_TYPE, required: false })
  @IsOptional()
  @IsEnum(WAREHOUSE_TYPE)
  warehouseType: WAREHOUSE_TYPE;
}