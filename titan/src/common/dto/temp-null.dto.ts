import { IsBoolean } from 'class-validator';

// 예외 필터 적용 시 에러 방지 위해 작성한 임시 Dto
export class TempNullDto {
  @IsBoolean()
  data = true;
}