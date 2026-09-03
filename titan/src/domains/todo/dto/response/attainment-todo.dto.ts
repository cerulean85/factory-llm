import { Expose, Transform } from 'class-transformer';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { TodoResponseDto } from './todo-response.dto';

export class AttainmentTodoDto extends PartialType(TodoResponseDto){
  @ApiProperty({ description: '달성량', example: 57, default: -1, type: Number})
  @Expose()
  @Transform(({ obj }) => obj.attainmentCount ?? obj.attainment_count)
  attainmentCount: number = 0;

  @ApiProperty({ description: '달성률', example: 33.33, default: 0, type: Number})
  @Expose()
  @Transform(({ obj }) => obj.attainmentRate ?? obj.attainment_rate)
  attainmentRate: number = 0.00;
}