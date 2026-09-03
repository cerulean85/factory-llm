import { IsString, IsEmail, IsBoolean, IsOptional, Length, Matches, IsPhoneNumber, IsNumber } from 'class-validator';
import { Exclude, Expose, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUsersDto {
  @ApiProperty({ name: 'userId', description: '유저 로그인 ID', example: 'test_id', default: '', type: String })
  @Expose({ name: 'userId' })
  @IsString()
  @Length(1, 20, {message: 'ID must be 1 to 20 characters.'})
  user_id: string = '';

  @ApiProperty({ description: '비밀번호', example: 'passwd', default: '', type: String })
  @Expose()
  @IsString()
  @Matches(/^(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?/~\-]).{8,16}$/, {
    message: 'Password must be 8 to 16 characters long and contains at least one special character.'})
  @Matches(/^(?!.*(.)\1\1).*$/, {
    message: 'Password cannot contain the same character or number more than three times in a row.'})
  password: string = '';

  @ApiProperty({ description: '이메일', example: 'test@hanwha.com', default: '', type: String })
  @Expose()
  @IsEmail()
  @Length(1, 50)
  @IsOptional()
  email: string = "";

  @ApiProperty({ description: '이름', example: '홍길동', default: '', type: String })
  @Expose()
  @IsString()
  @Length(1, 30)
  name: string = "";

  @ApiProperty({ description: '소속', example: '연구소', default: '', type: String })
  @Expose()
  @IsString()
  @Length(1, 50)
  @IsOptional()
  affiliation: string = "";

  @ApiProperty({ name: 'phoneNumber', description: '국제전화번호', example: '821012341234', default: '', type: String })
  @Expose({ name: 'phoneNumber' })
  @Transform(({ value }) => value.replace(/[^0-9]/g, ''))
  @IsString()
  @Matches(/^[0-9]{10,12}$/, {message: 'Phone number must be 10 to 12 digits.'})
  @IsOptional()
  phone_number: string = "";
}