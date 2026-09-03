import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ItemMasterView } from '../entities/item-master-view.entity';
import { ItemMasterViewBaseRepository } from './item-master-view.base.repository';
import { Pagination } from 'src/utils/pagination.util';


@Injectable()
export class ItemMasterViewRepository extends ItemMasterViewBaseRepository {
  constructor(
    @InjectRepository(ItemMasterView)
    repository: Repository<ItemMasterView>,
    pagination: Pagination
  ) {super(repository, pagination);}

}