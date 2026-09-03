import { PartialType } from '@nestjs/swagger';
import { CreateNotiDto } from './create-noti.dto';

export class UpdateNotiDto extends PartialType(CreateNotiDto) {} 