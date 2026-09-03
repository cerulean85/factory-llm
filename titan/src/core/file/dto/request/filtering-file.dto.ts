import { IsString, IsOptional, IsArray, IsNumber } from 'class-validator';
import { PaginationRequestDto } from 'src/common/dto/pagination-request.dto';
import { ApiProperty } from '@nestjs/swagger';

export class FilteringFileDto extends PaginationRequestDto {
  @ApiProperty({ description: '파일 ID', default: -1, type: Number, required: false })
  @IsOptional()
  @IsNumber()
  fileId: number;

  @ApiProperty({ description: '파일 ID 리스트', example: [1, 2], default: [], type: Array, required: false })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  fileIdList: number[] = [];

  @ApiProperty({ description: '파일 이름', example: 'test.jpg', type: String, required: false })
  @IsOptional()
  @IsString()
  fileName: string;

  @ApiProperty({ description: '파일 경로', example: 'test.jpg', type: String, required: false })
  @IsOptional()
  @IsString()
  filePath: string;
}