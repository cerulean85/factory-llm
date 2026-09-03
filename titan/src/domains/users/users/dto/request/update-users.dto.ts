import { IsString, IsEmail, IsOptional, Length, Matches } from 'class-validator';
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUsersDto {
  @ApiProperty({ description: '비밀번호', example: 'passwd', default: '', type: String })
  @Expose()
  @IsOptional()
  @IsString()
  @Matches(/^(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?/~\-]).{8,16}$/, {
    message: 'Password must be 8 to 16 characters long and contains at least one special character.'})
  @Matches(/^(?!.*(.)\1\1).*$/, {
    message: 'Password cannot contain the same character or number more than three times in a row.'})
  password?: string;
  
  @ApiProperty({ description: '이름', example: '홍길동', default: '', type: String })
  @Expose()
  @IsOptional()
  @IsString()
  @Length(1, 30)
  name?: string;

  @ApiProperty({ name: 'phoneNumber', description: '전화번호', example: '010-1234-1234', default: '', type: String })
  @Expose({ name: 'phoneNumber' })
  @IsOptional()
  @IsString()
  phone_number?: string;

  @ApiProperty({ description: '소속', example: '연구소', default: '', type: String })
  @Expose()
  @IsOptional()
  @IsString()
  @Length(1, 50)
  affiliation?: string;

  @ApiProperty({ description: '이메일', example: 'test@hanwha.com', default: '', type: String })
  @Expose()
  @IsOptional()
  @IsEmail()
  @Length(1, 50)
  email?: string;
}