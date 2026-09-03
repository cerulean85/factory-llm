import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString, Length } from "class-validator";
import { FilteringAlarmHistoryDto } from "../../../../dto/request/filtering-alarm-history.dto";

export class FilteringEquipmentAlarmHistoryDto{
  @ApiProperty({ description: '알람 ID', default: -1, type: Number, required: false })
  @IsOptional()
  @IsNumber()
  alarmId: number;

  @ApiProperty({ description: '조회할 중요도', default: '3,2,1', type: String, required: false })
  @IsOptional()
  @IsString()
  importanceList: string;

  @ApiProperty({ 
    description: '조회할 키워드 유형', 
    default: 'equipment_type,alarm_code,alarm_description,user_name',
    type: String, required: false })
  @IsOptional()
  @IsString()
  keywordTypeList: string;

  @ApiProperty({ description: '검색할 키워드', default: '', type: String, required: false })
  @IsOptional()
  @IsString()
  @Length(0, 255)
  keyword: string;

  @ApiProperty({ description: '설비 이름', default: '', type: String, required: false })
  @IsOptional()
  @IsString()
  equipmentName: string;

  @ApiProperty({ description: '설비 코드', default: '', type: String, required: false })
  @IsOptional()
  @IsString()
  equipmentCode: string;
}