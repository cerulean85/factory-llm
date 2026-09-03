import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateEquipmentOperationHistoryDto } from "./create-equipment-operation-history.dto";

export class UpdateEquipmentOperationHistoryDto extends PartialType(
  OmitType(CreateEquipmentOperationHistoryDto, ['create_date', 'equipment_id'] as const),
) {}