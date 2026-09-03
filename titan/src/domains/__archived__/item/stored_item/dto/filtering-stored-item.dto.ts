import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString, Length } from "class-validator";

export class FilteringStoredItemDto {
  @ApiProperty({ description: '적재 아이템 ID', default: -1, type: Number, required: false })
  @IsOptional()
  @IsNumber()
  storedItemId: number;

  @ApiProperty({ description: '타이어 규격', default: '', type: String, required: false })
  @IsOptional()
  @IsString()
  @Length(30)
  standardType: string;

  @ApiProperty({ description: '적재 아이템 고유 번호', default: '', type: String, required: false })
  @IsOptional()
  @IsString()
  @Length(50)
  skuId: string;
}