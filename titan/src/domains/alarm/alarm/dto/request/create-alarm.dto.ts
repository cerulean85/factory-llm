import { ApiProperty } from '@nestjs/swagger';
import { Transform, Expose, Type } from 'class-transformer';
import { IsNumber, IsString, Length, IsOptional, IsInt, IsArray, IsBoolean, IsIn, ValidateIf, IsEnum } from 'class-validator';
import { ALARM_HISTORY_TYPE } from 'src/common/enum/alarm.enum';

export class CreateAlarmDto {
  @ApiProperty({ description: '알람 코드', example: 'test_code', default: '', type: String })
  @Expose({ name: 'code' })
  @Type(() => String)
  @IsString()
  @Length(1, 50)
  code: string = "";

  @ApiProperty({ description: '알람 타입', example: ALARM_HISTORY_TYPE.EQUIPMENT, default: ALARM_HISTORY_TYPE.EQUIPMENT, enum: ALARM_HISTORY_TYPE })
  @Expose({ name: 'type' })
  @Type(() => String)
  @IsEnum(ALARM_HISTORY_TYPE)
  type: ALARM_HISTORY_TYPE = ALARM_HISTORY_TYPE.EQUIPMENT;

  @ApiProperty({ description: '알람 설명', example: 'test_description', default: '', type: String, required: false })
  @Expose({ name: 'description' })
  @IsOptional()
  @ValidateIf((obj, value) => value !== "")
  @Type(() => String)
  @IsString()
  @Length(0, 500)
  description: string = "";
  
  @ApiProperty({ description: '중요도', example: 3, default: -1, type: Number})
  @Expose()
  @IsNumber({}, { message: 'Importance must be a number' })
  @Type(() => Number)
  @ValidateIf((obj, value) => value.importance !== -1)
  @IsIn([1, 2, 3], { message: 'Importance must be 1, 2, or 3' })
  importance: number = -1;

  @ApiProperty({ name: 'processMethod', description: '조치 방법', example: 'test_process_method', default: '', type: String})
  @Expose({ name: 'processMethod' })
  @Type(() => String)
  @IsOptional()
  @IsString()
  @Length(0, 50)
  process_method: string = "";

  @ApiProperty({ name: 'fileIdList', description: '매뉴얼 파일 리스트', example: [1,2], default: [], type: [Number], isArray: true, required: false })
  @Expose({ name: 'fileIdList' })
  @Type(() => Array)
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  file_id_list: number[] = [];

  @ApiProperty({ name: 'sendEnabled', description: 'SNS 전송 여부', example: false, default: false, type: Boolean, required: false })
  @Expose({ 'name': 'sendEnabled' })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  send_enabled: boolean = false;

  @ApiProperty({ name: 'resetAvailable', description: '리셋 조치 가능 여부', example: false, default: false, type: Boolean, required: false })
  @Expose({ 'name': 'resetAvailable' })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  reset_available: boolean = false;

  @ApiProperty({ name: 'equipmentTypeId', description: '설비 유형', example: 1, default: -1, type: Number, required: false })
  @Expose({ name: 'equipmentTypeId' })
  @IsOptional()
  @Transform(({ obj }) => obj.equipmentTypeId)
  @IsInt()
  equipment_type_id: number = -1;

  @ApiProperty({ name: 'userSeqIdList', description: '담당자 목록', example: [1,2], default: [], type: [Number], isArray: true, required: false })
  @Expose({ name: 'userSeqIdList' })
  @IsOptional()
  // @Transform(({ obj }) => obj.userSeqIdList ?? [])
  @Transform(({ value }) => typeof value === 'string' ? value.split(',').map(num => Number(num.trim())) : value)
  @IsArray()         
  @IsInt({ each: true }) 
  user_seq_id_list: number[] = [];
}