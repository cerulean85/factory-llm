import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString } from "class-validator";
import { FilteringDateDto } from "src/common/dto/filtering-date.dto";

export class FilteringPalletDto extends FilteringDateDto {
  @ApiProperty({ description: 'Pallet ID', default: -1, type: Number, required: false })
  @IsOptional()
  @IsNumber() 
  palletId: number;

  @ApiProperty({ description: 'Pallet Code', default: 'rfid6782', type: String, required: false })
  @IsOptional()
  @IsString()
  code: number;
}