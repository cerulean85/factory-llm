import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GantryCell } from '../entities/gantry-cell.entity';
import { UpdateGantryCellDto } from '../dto/request/update-gantry-cell.dto';
import { GantryCellBaseRepository } from './gantry-cell.base.repository';
import { Pagination } from 'src/utils/pagination.util';


@Injectable()
export class GantryCellRepository extends GantryCellBaseRepository {
  constructor(
    @InjectRepository(GantryCell)
    repository: Repository<GantryCell>,
    pagination: Pagination,
  ) {super(repository, pagination);}

  async updateGantryCell(gantryCell: GantryCell, updateGantryCellDto: UpdateGantryCellDto): Promise<boolean> {
    this.repository.merge(gantryCell, {
      update_date: new Date(),
      ...updateGantryCellDto
    });
    const result = await this.repository.save(gantryCell);
    return result ? true : false;
  };
};