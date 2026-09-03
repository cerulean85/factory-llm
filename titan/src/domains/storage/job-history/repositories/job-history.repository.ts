import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { JobHistory } from '../entities/job-history.entity';
import { CreateJobHistoryDto } from '../dto/request/create-job-history.dto';
import { UpdateJobHistoryDto } from '../dto/request/update-job-history.dto';
import { JobHistoryBaseRepository } from './job-history.base.repository';
import { Pagination } from 'src/utils/pagination.util';
import { Pallet } from '../../pallet/entities/pallet.entity';
import { Warehouse } from '../../warehouse/entities/warehouse.entity';

@Injectable()
export class JobHistoryRepository extends JobHistoryBaseRepository {
  constructor(
    @InjectRepository(JobHistory)
    repository: Repository<JobHistory>,
    pagination: Pagination,
  ) {
    super(repository, pagination);
  }

  async createJobHistory(pallet: Pallet, warehouse: Warehouse, dto: CreateJobHistoryDto): Promise<JobHistory> {
    const newHistory = this.repository.create({
      pallet: pallet,
      warehouse: warehouse,
      ...dto
    });
    const result = await this.repository.save(newHistory);
    return result;
  }

  //bulk insert이므로 외래키에 대한 예외처리는 되어있지 않음. service에서 예외처리를 해줘야함.
  async bulkInsertJobHistory(
    entities: DeepPartial<JobHistory>[],
  ): Promise<JobHistory[]> {
    const BATCH_SIZE = 1000;
    const inserted: JobHistory[] = [];

    for (let i = 0; i < entities.length; i += BATCH_SIZE) {
      const batch = entities.slice(i, i + BATCH_SIZE);
      const result = await this.repository.save(batch);
      inserted.push(...result);
    }

    return inserted;
  }

  async insertJobHistory(jobHistory: JobHistory): Promise<JobHistory> {
    const result = await this.repository.save(jobHistory);
    return result;
  }

  async updateJobHistory(history: JobHistory, dto: UpdateJobHistoryDto): Promise<boolean> {
    this.repository.merge(history, {
      ...dto
    });
    const result = await this.repository.save(history);
    return result ? true : false;
  }
}