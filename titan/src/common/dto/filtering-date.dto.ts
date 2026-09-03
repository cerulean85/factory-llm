import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";
import { DateTransform } from "../decorator/date-transform.decorator";

export class FilteringDateDto {
  @ApiProperty({ description: '조회 시작 날짜', default: undefined, example: '2025-07-10T08:00:00', type: Date })
  @IsOptional()
  @DateTransform()
  startDate: Date;

  @ApiProperty({ description: '조회 종료 날짜', default: undefined, example: '2025-07-10T10:00:00', type: Date })
  @IsOptional()
  @DateTransform()
  endDate: Date;
}