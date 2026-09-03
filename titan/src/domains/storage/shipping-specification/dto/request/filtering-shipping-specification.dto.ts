import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, IsOptional } from "class-validator";

export class FilteringShippingSpecificationDto {
  @ApiProperty({ description: '중점 출고 규격 ID', default: -1, type: Number, required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  shippingSpecificationId: number;
}