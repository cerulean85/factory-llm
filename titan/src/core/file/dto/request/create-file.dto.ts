import { Exclude, Expose, Type } from 'class-transformer';
import { IsString, Length } from 'class-validator';

export class CreateFileDto {
  @Expose()
  @Type(() => String)
  @IsString()
  name: string = "";

  @Expose({ name: 'storedName' })
  @Type(() => String)
  @IsString()
  stored_name: string = "";

  @Expose()
  @Type(() => String)
  @IsString()
  path: string = "";
}