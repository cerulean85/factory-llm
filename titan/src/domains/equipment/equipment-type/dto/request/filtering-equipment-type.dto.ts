import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString } from "class-validator";
import { Type } from "class-transformer";
import { PaginationRequestDto } from "src/common/dto/pagination-request.dto";

export class FilteringEquipmentTypeDto extends PaginationRequestDto {
  @ApiProperty({ description: '장비 타입 ID', default: -1, type: Number, required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  equipmentTypeId: number;

  @ApiProperty({ description: '장비 타입 이름', default: '', type: String, required: false })
  @IsOptional()
  @Type(() => String)
  @IsString()
  equipmentTypeName: string;
}