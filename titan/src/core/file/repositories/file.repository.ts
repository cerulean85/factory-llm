import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';

import { FileDto } from '../entities/file.entity';
import { CreateFileDto } from '../dto/request/create-file.dto';
import { UpdateFileDto } from '../dto/request/update-file.dto';
import { FileBaseRepository } from './file.base.repository';
import { Pagination } from 'src/utils/pagination.util';

@Injectable()
export class FileRepository extends FileBaseRepository {
  constructor(
    @InjectRepository(FileDto)
    repository: Repository<FileDto>,
    pagination: Pagination
  ) {super(repository, pagination);}

  async createFile(createFileDto: CreateFileDto): Promise<FileDto> {
    const newFile = this.repository.create(createFileDto);
    return await this.repository.save(newFile);
  }

  async updateFile(fileId: number, updateFileDto: UpdateFileDto): Promise<FileDto | null> {
    await this.repository.update({id : fileId}, {
      update_date: new Date(),
      ...updateFileDto
    });
    return await this.repository.findOne({ where: { id: fileId } });
  }

  async deleteFile(fileId: number): Promise<boolean> {
    const result = await this.repository.delete({ id: fileId });
    return result ? true : false;
  }
}