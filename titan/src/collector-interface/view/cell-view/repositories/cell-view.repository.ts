import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CellView } from '../entities/cell-view.entity';
import { CellViewBaseRepository } from './cell-view.base.repository';
import { Pagination } from 'src/utils/pagination.util';


@Injectable()
export class CellViewRepository extends CellViewBaseRepository {
  constructor(
    @InjectRepository(CellView)
    repository: Repository<CellView>,
    pagination: Pagination
  ) {super(repository, pagination);}

}