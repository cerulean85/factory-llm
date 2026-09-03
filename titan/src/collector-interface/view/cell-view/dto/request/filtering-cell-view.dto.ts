import { IsOptional, IsNumber, IsBoolean, IsString, IsDate, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CELL_STATUS } from 'src/common/enum/cell.enum';
import { WAREHOUSE_TYPE } from 'src/common/enum/equipment.enum';

export class FilteringCellViewDto {
  @ApiProperty({ description: '창고 타입', default: '', enum: WAREHOUSE_TYPE })
  @IsOptional()
  @IsEnum(WAREHOUSE_TYPE)
  warehouseType: string;

  @ApiProperty({ description: '창고 코드 (식별자)', default: '', type: String })
  @IsOptional()
  @IsString()
  warehouseCode: string;

  @ApiProperty({ description: 'Pallet ID', default: -1, type: Number })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  palletId: number;

  @ApiProperty({ description: '적재 위치 (bank)', default: -1, type: Number })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  locX: number;

  @ApiProperty({ description: '적재 위치 (bay)', default: -1, type: Number })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  locY: number;

  @ApiProperty({ description: '적재 위치 (level)', default: -1, type: Number })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  locZ: number;

  @ApiProperty({ description: '화물 유무', default: false, type: Boolean })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  luggageFlag: boolean;

  @ApiProperty({ description: '배치 번호', default: '', type: String })
  @IsOptional()
  @IsString()
  batchNumber: string;

  @ApiProperty({ description: '오더 번호', default: '', type: String })
  @IsOptional()
  @IsString()
  orderNumber: string;

  @ApiProperty({ description: '창고 ID', default: -1, type: Number })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  warehouseId: number;

  @ApiProperty({ description: '사용 여부', default: true, type: Boolean })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  enable: boolean;

  @ApiProperty({ description: '입고 조회 시작일', default: '', type: Date })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  InStartDate: Date;

  @ApiProperty({ description: '입고 조회 종료일', default: '', type: Date })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  InEndDate: Date;

  @ApiProperty({ description: '셀 상태', default: '', enum: CELL_STATUS })
  @IsOptional()
  @Type(() => String)
  @IsEnum(CELL_STATUS)
  cellStatus: String;
}