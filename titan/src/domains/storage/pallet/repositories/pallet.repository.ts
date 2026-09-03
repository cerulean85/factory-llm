import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pallet } from '../entities/pallet.entity';
import { Pagination } from 'src/utils/pagination.util';
import { PalletBaseRepository } from './pallet.base.repository';


@Injectable()
export class PalletRepository extends PalletBaseRepository {
  constructor(
    @InjectRepository(Pallet)
    repository: Repository<Pallet>,
    pagination: Pagination,
  ) {super(repository, pagination);}
}
