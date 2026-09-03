import { Expose, Transform } from 'class-transformer';
import { IsString, Length, IsOptional, IsInt, IsDate, ValidateIf, IsArray, ArrayNotEmpty, IsNumber, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationRequestDto } from 'src/common/dto/pagination-request.dto';
import { ApiProperty } from '@nestjs/swagger';
import { DateTransform } from 'src/common/decorator/date-transform.decorator';
import { ALARM_HISTORY_PROCESS_FLAG, ALARM_HISTORY_TYPE } from 'src/common/enum/alarm.enum';
import { TransformEnumArray } from 'src/common/decorator/transfor-enum-array.decorator';
import { FilteringEquipmentAlarmHistoryDto } from '../../sub-domain/equipment-alarm-history/dto/request/filtering-equipment-alarm-history.dto';
import { FilteringInventoryAlarmHistoryDto } from '../../sub-domain/inventory-alarm-history/dto/request/filtering-inventory-alarm-history.dto';
import { FilteringPalletAlarmHistoryDto } from '../../sub-domain/pallet-alarm-history/dto/request/filtering-pallet-alarm-history.dto';

export class FilteringAlarmHistoryDto extends PaginationRequestDto {

  @ApiProperty({ description: '알람 히스토리 ID', default: undefined, type: Number, required: false })
  @IsOptional()
  @Type(() =>  Number)
  @IsNumber()
  alarmHistoryId: number;

  @ApiProperty({
    description: '알람 타입 리스트',
    enum: ALARM_HISTORY_TYPE,
    isArray: true,
    example: [ALARM_HISTORY_TYPE.EQUIPMENT, ALARM_HISTORY_TYPE.INVENTORY],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @TransformEnumArray(ALARM_HISTORY_TYPE)
  @IsEnum(ALARM_HISTORY_TYPE, { each: true })
  @Type(() => String)
  alarmTypeList: ALARM_HISTORY_TYPE[] = [ALARM_HISTORY_TYPE.EQUIPMENT, ALARM_HISTORY_TYPE.INVENTORY];


  @ApiProperty({ description: '알람발생-조회시작일', example: '2025-01-01', default: null, type: Date, required: false })
  @IsOptional()
  @DateTransform()
  alarmStartDate: Date | null = null;

  @ApiProperty({ description: '알람발생-조회종료일', example: '2025-12-31', default: null, type: Date, required: false })
  @IsOptional()
  @DateTransform()
  alarmEndDate: Date | null = null;

  @ApiProperty({ description: '조치 여부', example: 'Y', required: false, enum: ALARM_HISTORY_PROCESS_FLAG })
  @IsOptional()
  @IsEnum(ALARM_HISTORY_PROCESS_FLAG, { each: true })
  processType: ALARM_HISTORY_PROCESS_FLAG = ALARM_HISTORY_PROCESS_FLAG.PROCESSED

  @ApiProperty({ description: '알람조치-조회시작일', example: '2025-01-01', default: null, type: Date, required: false })
  @IsOptional()
  @DateTransform()
  processStartDate: Date | null = null;

  @ApiProperty({ description: '알람조치-조회종료일', example: '2025-12-31', default: null, type: Date, required: false })
  @IsOptional()
  @DateTransform()
  processEndDate: Date | null = null;

  @ApiProperty({ description: '설비 알람 필터링', default: null, type: () => FilteringEquipmentAlarmHistoryDto, required: false })
  @IsOptional()
  @Type(() => FilteringEquipmentAlarmHistoryDto)
  filteringEquipmentAlarmHistory: FilteringEquipmentAlarmHistoryDto | null = null;

  @ApiProperty({ description: '재고 알람 필터링', default: null, type: () => FilteringInventoryAlarmHistoryDto, required: false })
  @IsOptional()
  @Type(() => FilteringInventoryAlarmHistoryDto)
  filteringInventoryAlarmHistory: FilteringInventoryAlarmHistoryDto | null = null;

  @ApiProperty({ description: 'Pallet 알람 필터링', default: null, type: () => FilteringPalletAlarmHistoryDto, required: false })
  @IsOptional()
  @Type(() => FilteringPalletAlarmHistoryDto)
  filteringPalletAlarmHistory: FilteringPalletAlarmHistoryDto | null = null;
}