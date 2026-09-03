import { Expose, Type } from 'class-transformer';
import { IsString, Length } from 'class-validator';

export class FileResponseDto {
  @Expose()
  id: number = -1;

  @Expose()
  @Type(() => String)
  @IsString()
  name: string = "";

  @Expose({ name: 'stored_name' })
  @Type(() => String)
  @IsString()
  storedName: string = "";

  @Expose()
  @Type(() => String)
  @IsString()
  path: string = "";
}