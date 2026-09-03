import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { CraneCell } from '../entities/crane-cell.entity';
import { ORDER } from 'src/common/enum/db.enum';
import { FilteringCraneCellDto } from '../dto/request/filtering-crane-cell.dto';
import { UpdateCraneCellDto } from '../dto/request/update-crane-cell.dto';
import { CraneCellBaseRepository } from './crane-cell.base.repository';
import { Pagination } from 'src/utils/pagination.util';


@Injectable()
export class CraneCellRepository extends CraneCellBaseRepository {
  constructor(
    @InjectRepository(CraneCell)
    repository: Repository<CraneCell>,
    pagination: Pagination,
  ) {super(repository, pagination);}

  async updateCraneCell(craneCell: CraneCell, dto: UpdateCraneCellDto): Promise<boolean> {
    this.repository.merge(craneCell, {
      update_date: new Date(),
      ...dto
    });
    const result = await this.repository.save(craneCell);
    return result ? true : false;
  }
}