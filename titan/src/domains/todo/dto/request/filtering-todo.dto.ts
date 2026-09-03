import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsBoolean, IsNumber, IsOptional } from "class-validator";
import { DateTransform } from "src/common/decorator/date-transform.decorator";
import { PaginationRequestDto } from "src/common/dto/pagination-request.dto";

export class FilteringTodoDto extends PaginationRequestDto {
  @ApiProperty({ description: 'Todo ID', default: -1, type: Number, required: false })
  @IsOptional()
  @IsNumber()
  todoId: number;

  @ApiProperty({ description: '알람 처리 여부', default: false, type: Boolean, required: false })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  alarmProcessFlag: boolean;

  @ApiProperty({ description: '목표일-조회시작일', example: '2025-01-01', default: null, type: Date, required: false })
  @IsOptional()
  @DateTransform()
  targetStartDate: Date | null = null;

  @ApiProperty({ description: '목표일-조회종료일', example: '2025-12-31', default: null, type: Date, required: false })
  @IsOptional()
  @DateTransform()
  targetEndDate: Date | null = null;
}