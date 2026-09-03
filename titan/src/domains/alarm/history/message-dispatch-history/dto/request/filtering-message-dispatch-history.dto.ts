import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { ArrayNotEmpty, IsArray, IsNumber, IsOptional, IsString, Length, ValidateIf } from "class-validator";
import { PaginationRequestDto } from "src/common/dto/pagination-request.dto";

export class FilteringMessageDispatchHistoryDto extends PaginationRequestDto {
  @ApiProperty({ description: 'ID', type: Number, required: false, example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  id: number;

  @ApiProperty({
    description: '히스토리 ID 목록',
    type: Number,
    required: false,
    example: 1,
  })
  @IsOptional()
  //@IsArray()
  //@ArrayNotEmpty()
  @Type(() => Number)
  //@IsNumber({}, { each: true })
  @IsNumber()
  alarmHistoryId: number;

}
