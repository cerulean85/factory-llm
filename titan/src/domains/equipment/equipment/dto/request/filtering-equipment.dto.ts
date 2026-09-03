import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsArray, IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { TransformEnumArray } from "src/common/decorator/transfor-enum-array.decorator";
import { EQUIPMENT_TYPE } from "src/common/enum/equipment.enum";

export class FilteringEquipmentDto {
  @ApiProperty({ description: '설비 ID', default: -1, type: Number, required: false })
  @IsOptional()
  @Type(() =>  Number)
  @IsNumber()
  equipmentId: number;

  @ApiProperty({ description: '설비 이름', default: '', type: String, required: false })
  @IsOptional()
  @Type(() => String)
  @IsString()
  equipmentName: string;

  @ApiProperty({ description: '설비 코드', default: '', type: String, required: false })
  @IsOptional()
  @Type(() => String)
  @IsString()
  equipmentCode: string;

  @ApiPropertyOptional({ description: '설비 타입명 목록(IN)', enum: EQUIPMENT_TYPE, isArray: true, example: ['RGV','CNV'] })
  @IsOptional()
  @IsArray()
  @IsEnum(EQUIPMENT_TYPE, { each: true })
  @TransformEnumArray(EQUIPMENT_TYPE)
  equipmentTypeNameList?: EQUIPMENT_TYPE[];
  
  @ApiProperty({ description: '창고 ID', default: -1, type: Number, required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  warehouseId: number;
}