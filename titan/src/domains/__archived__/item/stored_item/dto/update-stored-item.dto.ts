import { PartialType } from "@nestjs/swagger";
import { CreateStoredItemDto } from "./create-stored-item.dto";

export class UpdateStoredItemDto extends PartialType(CreateStoredItemDto) {}