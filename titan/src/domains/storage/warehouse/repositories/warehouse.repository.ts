import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Warehouse } from '../entities/warehouse.entity';
import { WarehouseBaseRepository } from './warehouse.base.repository';
import { Pagination } from 'src/utils/pagination.util';


@Injectable()
export class WarehouseRepository extends WarehouseBaseRepository {
  constructor(
    @InjectRepository(Warehouse)
    repository: Repository<Warehouse>,
    pagination: Pagination
  ) {super(repository, pagination);}

  async deleteWarehouse(id: number): Promise<boolean> {
    const result = await this.repository.update(id, {valid_record: false});
    return result.affected !== undefined && result.affected > 0;
  }
}
