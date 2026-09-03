import { Expose, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { EQUIPMENT_TYPE } from 'src/common/enum/equipment.enum';

export class EquipmentResponseDto {
  @ApiProperty({ description: 'ID', default: -1, type: Number })
  @Expose({ name: 'id' })
  equipmentId: number = -1;

  @ApiProperty({ description: '이름', example: 'GANTRY_#1', default: '', type: String })
  @Expose({ name: 'name' })
  equipmentName: string = '';

  @ApiProperty({ description: '생성 날짜', example: new Date(), default: '', type: Date })
  @Expose({ name: 'create_date' })
  createDate: Date = new Date();

  @ApiProperty({ description: '수정 날짜', example: new Date(), default: '', type: Date })
  @Expose({ name: 'update_date' })
  updateDate: Date = new Date();

  @ApiProperty({ description: '설비 스펙', example: '', default: '', type: String })
  @Expose({ name: 'spec' })
  spec: string = '';

  @ApiProperty({ description: '설비 코드', example: 'G111', default: '', type: String })
  @Expose({ name: 'code' })
  equipmentCode: string = '';

  @ApiProperty({ description: '사용 여부', example: true, default: '', type: Boolean })
  @Expose({ name: 'valid_record' })
  validRecord: boolean = true;

  @ApiProperty({ description: '유형 ID', example: 1, default: -1, type: Number })
  @Expose({ name: 'equipment_type_id' })
  @Transform(({ obj }) => obj.equipment_type?.id)
  equipmentTypeId: number = -1;

  @ApiProperty({ description: '유형 이름', example: 'GANTRY', default: '', type: String })
  @Expose({ name: 'equipment_type_name' })
  @Transform(({ obj }) => obj.equipment_type?.name)
  equipmentTypeName: string = '';

  @ApiProperty({ description: '유형 타입', example: 'GTR', default: '', type: String })
  @Expose({ name: 'equipment_type' })
  @Transform(({ obj }) => obj.equipment_type?.type)
  equipmentType: EQUIPMENT_TYPE = EQUIPMENT_TYPE.CNV;

  @ApiProperty({ description: '유형 설명', example: '갠트리정보', default: '', type: String })
  @Expose({ name: 'equipment_type_description' })
  @Transform(({ obj }) => obj.equipment_type?.description)
  equipmentTypeDescription: string = '';
  
  @ApiProperty({ description: '창고 ID', example: 1, default: -1, type: Number })
  @Expose({ name: 'warehouse_id' })
  @Transform(({ obj }) => obj.warehouse?.id)
  warehouseId: number = -1;

  @ApiProperty({ description: '창고 코드', example: '', default: '', type: String })
  @Expose({ name: 'warehouse_code' })
  @Transform(({ obj }) => obj.warehouse?.code)
  warehouseCode: string = '';
}