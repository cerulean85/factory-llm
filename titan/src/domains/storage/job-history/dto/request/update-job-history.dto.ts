import { PartialType } from '@nestjs/swagger';
import { CreateJobHistoryDto } from './create-job-history.dto';

export class UpdateJobHistoryDto extends PartialType(CreateJobHistoryDto) {} 