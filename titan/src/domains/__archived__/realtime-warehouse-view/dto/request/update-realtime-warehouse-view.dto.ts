import { PartialType } from '@nestjs/swagger';
import { CreateRealtimeWarehouseViewDto } from "./create-realtime-warehouse-view.dto";

export class UpdateRealtimeWarehouseViewDto extends PartialType(CreateRealtimeWarehouseViewDto) {}