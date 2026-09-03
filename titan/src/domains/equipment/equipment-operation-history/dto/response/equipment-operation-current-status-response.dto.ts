import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { OPERATION_STATUS } from "src/common/enum/equipment.enum";

export class EquipmentOperationCurrentStatusResponseDto {
  @ApiProperty({ description: '설비코드(식별자)', default: 'gtr-12356-sv', type: String })
  @Expose()
  equipmentCode: string = '';

  @ApiProperty({ description: '현재설비상태', default: OPERATION_STATUS.START, enum: OPERATION_STATUS })
  @Expose()
  runningState: OPERATION_STATUS = OPERATION_STATUS.START;

  @ApiProperty({ description: '에러코드', default: '', type: String })
  @Expose()
  errorCode: string = '';

  @ApiProperty({ description: '설비코드(식별자)', default: '', type: String })
  @Expose()
  errorDesc: string = '';
}