import { ApiProperty } from "@nestjs/swagger";

export class ApiResponseStatusDto {
  @ApiProperty({ example: true })
  isSuccess: boolean;

  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: '성공적으로 처리되었습니다.' })
  message: string;
}

export class ApiResponseFormat<T> {
  @ApiProperty({ type: () => ApiResponseStatusDto })
  status: ApiResponseStatusDto;

  @ApiProperty({ type: () => Object }) // 구체 클래스에서 명시 필요
  data: T;
}