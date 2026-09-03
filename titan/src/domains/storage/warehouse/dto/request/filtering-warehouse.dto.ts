import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsString } from "class-validator";
import { PaginationRequestDto } from "src/common/dto/pagination-request.dto";

export class FilteringWarehouseDto extends PaginationRequestDto {
  @ApiProperty({ description: '창고 ID', default: -1, type: Number, required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  warehouseId: number;

  @ApiProperty({ description: '창고 코드', default: '', type: String, required: false })
  @IsOptional()
  @IsString()
  code: string;

  @ApiProperty({ description: '창고 이름', default: '', type: String, required: false })
  @IsOptional()
  @IsString()
  name: string;
}