import { Expose } from 'class-transformer';
import { IsInt, IsOptional, IsString, Length } from 'class-validator';

export class CreateEquipmentDto {
  @Expose()
  @IsString()
  @IsOptional()
  @Length(1, 500)
  spec: string;

  @Expose({ name: 'equipmentTypeId' })
  @IsInt()
  equipment_type_id: number;

  @Expose()
  @IsString()
  @Length(1, 50)
  name: string;

  @Expose()
  @IsString()
  @IsOptional()
  @Length(1, 10)
  code: string;
  
  @Expose({ name: 'warehouseId' })
  @IsInt()
  warehouse_id: number;
}