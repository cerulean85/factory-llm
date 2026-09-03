import { PartialType } from '@nestjs/swagger';
import { CreateFileDto } from './create-file.dto';

export class DownloadFileDto extends PartialType(CreateFileDto) {} 