import { IsEnum, IsOptional, IsString, Length } from 'class-validator';
import { EQUIPMENT_TYPE } from 'src/common/enum/equipment.enum';

export class CreateEquipmentTypeDto {
  @IsString()
  @Length(1, 50)
  name: string;

  @IsString()
  @Length(1, 500)
  description: string;

  @IsEnum(EQUIPMENT_TYPE)
  @IsOptional()
  type: EQUIPMENT_TYPE;
}