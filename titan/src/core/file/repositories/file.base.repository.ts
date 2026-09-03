import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, SelectQueryBuilder } from 'typeorm';

import { FileDto } from '../entities/file.entity';
import { BaseRepositoryContract } from 'src/common/repository/base-repository-contract';
import { Pagination } from 'src/utils/pagination.util';
import { FilteringFileDto } from '../dto/request/filtering-file.dto';
import { ORDER } from 'src/common/enum/db.enum';

export interface IFileQueryOptions {
  filter?: FilteringFileDto;
  orderMap?: Partial<Record<FileOrderKey, ORDER>>;
}

export enum FileOrderKey {
  ID = 'file.id',
}

@Injectable()
export abstract class FileBaseRepository extends BaseRepositoryContract<FileDto, IFileQueryOptions> {
  constructor(
    @InjectRepository(FileDto)
    protected readonly repository: Repository<FileDto>,
    protected readonly pagination: Pagination
  ) {super(repository, pagination);}

  protected initializeDefaultOptions(
    options: IFileQueryOptions = {}
  ): Required<IFileQueryOptions> {
    return {
      filter: options.filter ?? new FilteringFileDto(),
      orderMap: options.orderMap ?? {},
    };
  }

  protected createQueryBuilder(
    options: IFileQueryOptions
  ): SelectQueryBuilder<FileDto> {
    const { filter, orderMap } = this.initializeDefaultOptions(options);
    const queryBuilder = this.createJoinQueryBuilder();
    const filteredQb = this.makeFilteredQueryBuilder(queryBuilder, filter);
    const orderedQb = this.makeOrderedQueryBuilder(filteredQb, orderMap);
    return orderedQb;
  }

  protected createJoinQueryBuilder(): SelectQueryBuilder<FileDto> {
    const queryBuilder = this.repository.createQueryBuilder('file');
    return queryBuilder;
  }

  protected makeFilteredQueryBuilder(
    queryBuilder: SelectQueryBuilder<FileDto>,
    filter: FilteringFileDto
  ): SelectQueryBuilder<FileDto> {
    if (filter.fileId) {
      queryBuilder.andWhere('file.id = :id', { id: filter.fileId });
    }
    if (filter.fileIdList && filter.fileIdList.length > 0) {
      queryBuilder.andWhere('file.id IN (:...ids)', { ids: filter.fileIdList });
    }
    if (filter.fileName) {
      queryBuilder.andWhere('file.name = :name', { name: filter.fileName });
    }
    if (filter.filePath) {
      queryBuilder.andWhere('file.path = :path', { path: filter.filePath });
    }
    return queryBuilder;
  }
}