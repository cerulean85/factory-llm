import { IsString, Length, IsOptional, IsEnum, IsArray, IsBoolean, IsInt } from 'class-validator';
import { PaginationRequestDto } from 'src/common/dto/pagination-request.dto';
import { ApiProperty } from '@nestjs/swagger';
import { ALARM_HISTORY_TYPE } from 'src/common/enum/alarm.enum';
import { Transform } from 'class-transformer';

export class FilteringAlarmDto extends PaginationRequestDto {

  @ApiProperty({ description: '조회할 알람 유형', default: [ALARM_HISTORY_TYPE.EQUIPMENT, ALARM_HISTORY_TYPE.INVENTORY], required: false, enum: ALARM_HISTORY_TYPE })
  @IsOptional()
  @IsArray()
  @IsEnum(ALARM_HISTORY_TYPE, { each: true })
  alarmTypeList: ALARM_HISTORY_TYPE[] = [ALARM_HISTORY_TYPE.EQUIPMENT, ALARM_HISTORY_TYPE.INVENTORY];

  @ApiProperty({ description: '조회할 중요도', default: '3,2,1', type: String, required: false })
  @IsOptional()
  @IsString()
  importanceList: string = '';

  @ApiProperty({ description: '매뉴얼 등록여부', default: '', type: String, required: false })
  @IsOptional()
  @IsString()
  manualValid: string = '';

  @ApiProperty({ description: '알람 전송여부', default: '', type: String, required: false })
  @IsOptional()
  @IsString()
  sendEnabled: string = '';

  @ApiProperty({ description: '검색 키워드', default: '', type: String, required: false })
  @IsOptional()
  @IsString()
  @Length(0, 255)
  keyword: string = '';

  @ApiProperty({ 
    description: '조회할 키워드 유형', 
    default: 'equipment,alarm_code,alarm_description,user_name',
    type: String, required: false })
  @IsOptional()
  @IsString()
  keywordTypeList: string = '';

  @ApiProperty({ description: '알람 ID', example: 1, default: -1, type: Number, required: false })
  @IsOptional()
  @IsInt()
  id: number;

  @ApiProperty({ description: '알람 삭제 여부', example: true, default: true, type: Boolean, required: false })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  validRecord: boolean;

  @ApiProperty({ description: '알람 코드', example: 'code', default: '', type: String, required: false })
  @IsOptional()
  @IsString()
  code: string;

  @ApiProperty({ description: '설비 타입 ID', example: 1, default: -1, type: Number, required: false })
  @IsOptional()
  @IsInt()
  equipmentTypeId: number;
}