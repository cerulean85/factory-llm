import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileService } from './file.service';
import { FileRepository } from './repositories/file.repository';
import { FileDto } from './entities/file.entity';
import { Pagination } from 'src/utils/pagination.util';

@Module({
  imports: [TypeOrmModule.forFeature([FileDto]),],
  providers: [FileService, FileRepository, Pagination],
  exports: [FileService]
})
export class FileModule {}