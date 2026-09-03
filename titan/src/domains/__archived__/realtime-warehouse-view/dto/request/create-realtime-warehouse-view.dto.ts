import { ApiProperty } from '@nestjs/swagger'
import { Expose, Transform, Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsInt, IsString, Length } from 'class-validator';
import { CELL_USE_TYPE } from 'src/common/enum/equipment.enum';

export class CreateRealtimeWarehouseViewDto {
  @ApiProperty({ name: 'equipmentCode', description: '설비 코드', example: 'G111', type: String })
  @Expose({ name: 'equipmentCode' })
  @Length(0, 50)
  @IsString()
  equipment_code: string;

  @ApiProperty({ name: 'loc_x', description: '위치정보 x', example: 1, default: 0, type: Number })
  @Expose({ name: 'loc_x' })
  @Type(() => Number)
  @IsInt()
  loc_x: number = 0;

  @ApiProperty({ name: 'loc_y', description: '위치정보 y', example: 1, default: 0, type: Number })
  @Expose({ name: 'loc_y' })
  @Type(() => Number)
  @IsInt()
  loc_y: number = 0;

  @ApiProperty({ name: 'loc_z', description: '위치정보 z', example: 1, default: 0, type: Number })
  @Expose({ name: 'loc_z' })
  @Type(() => Number)
  @IsInt()
  loc_z: number = 0;

  @ApiProperty({ name: 'loaded', description: 'Pallet 적재 여부', example: true, default: true, type: Boolean })
  @Expose({ name: 'loaded' })
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  loaded: boolean = true;

  @ApiProperty({ name: 'useType', description: 'shelf 사용 유형', example: CELL_USE_TYPE.NORMAL, enum: CELL_USE_TYPE })
  @Expose({ name: 'useType' })
  @Type(() => String)
  @IsEnum(CELL_USE_TYPE)
  use_type: CELL_USE_TYPE = CELL_USE_TYPE.NORMAL;

  @ApiProperty({ name: 'warehouseId', description: '창고 ID', example: 1, default: 0, type: Number })
  @Expose({ name: 'warehouseId' })
  @Type(() => Number)
  @IsInt()
  warehouse_id: number = 0;

  @ApiProperty({ name: 'standardType', description: '타이어 규격', example: 'winter-tire', type: String })
  @Expose({ name: 'standardType' })
  @Length(0, 100)
  @IsString()
  standard_type: string = '';

  @ApiProperty({ name: 'stCount', description: '타이어 개수', example: 0, default: 0, type: Number })
  @Expose({ name: 'stCount' })
  @Type(() => Number)
  @IsInt()
  st_count: number = 0;
}