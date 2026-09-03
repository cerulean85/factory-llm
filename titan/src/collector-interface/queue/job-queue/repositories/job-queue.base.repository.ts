import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository, SelectQueryBuilder  } from 'typeorm';
import { JobQueue } from '../entities/job-queue.entity';
import { ORDER } from 'src/common/enum/db.enum';
import { BaseRepositoryContract } from 'src/common/repository/base-repository-contract';
import { Pagination } from 'src/utils/pagination.util';

export interface IJobQueueQueryOptions {
  orderMap?: Partial<Record<JobQueueOrderKey, ORDER>>;
}

export enum JobQueueOrderKey {
  ID = 'job_queue.id',
  JOB_DATE = 'job_queue.job_date'
}

@Injectable()
export abstract class JobQueueBaseRepository extends BaseRepositoryContract<JobQueue, IJobQueueQueryOptions> {
  constructor(
    @InjectRepository(JobQueue)
    protected readonly repository: Repository<JobQueue>,
    protected readonly pagination: Pagination
  ) {super(repository, pagination);}

  protected initializeDefaultOptions(
    options: IJobQueueQueryOptions = {}
  ): Required<IJobQueueQueryOptions> {
    return {
      orderMap: options.orderMap ?? {},
    };
  }

  protected createQueryBuilder(
    options: IJobQueueQueryOptions
  ): SelectQueryBuilder<JobQueue> {
    const { orderMap } = this.initializeDefaultOptions(options);
    const queryBuilder = this.createJoinQueryBuilder();
    const orderedQb = this.makeOrderedQueryBuilder(queryBuilder, orderMap);
    return orderedQb;
  }

  protected createJoinQueryBuilder(): SelectQueryBuilder<JobQueue> {
    const queryBuilder = this.repository
      .createQueryBuilder('job_queue')
      .leftJoinAndSelect('job_queue.warehouse', 'warehouse')
      .leftJoinAndSelect('job_queue.pallet', 'pallet')
      .leftJoinAndSelect('job_queue.item_master_view', 'item_master_view')

    return queryBuilder;
  }

  protected makeFilteredQueryBuilder(
    queryBuilder: SelectQueryBuilder<JobQueue>,
  ): SelectQueryBuilder<JobQueue> {
    return queryBuilder;
  }
}