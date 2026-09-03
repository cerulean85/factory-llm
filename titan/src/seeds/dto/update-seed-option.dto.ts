import { PartialType } from '@nestjs/swagger';
import { CreateSeedOptionDto } from './create-seed-option.dto';

export class UpdateSeedOptionDto extends PartialType(CreateSeedOptionDto) {}