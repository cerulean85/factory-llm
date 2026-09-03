import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DockView } from '../entities/dock-view.entity';
import { DockViewBaseRepository } from './dock-view.base.repository';
import { Pagination } from 'src/utils/pagination.util';


@Injectable()
export class DockViewRepository extends DockViewBaseRepository {
  constructor(
    @InjectRepository(DockView)
    repository: Repository<DockView>,
    pagination: Pagination
  ) {super(repository, pagination);}

}