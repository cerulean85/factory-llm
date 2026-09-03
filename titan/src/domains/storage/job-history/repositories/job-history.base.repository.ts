import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { ORDER } from 'src/common/enum/db.enum';
import { JobHistory } from '../entities/job-history.entity';
import { FilteringJobHistoryDto } from '../dto/request/filtering-job-history.dto';
import { BaseRepositoryContract } from 'src/common/repository/base-repository-contract';
import { Pagination } from 'src/utils/pagination.util';
import { makeQuerybuilderToSql } from 'src/utils/database.util';


export interface IJobHistoryQueryOptions {
  filter?: FilteringJobHistoryDto;
  joinPallet?: boolean;
  joinWarehouse?: boolean;
  orderMap?: Partial<Record<JobHistoryOrderKey, ORDER>>;
}

export enum JobHistoryOrderKey{
  ID = 'job_history.id',
  CREATE_DATE = 'job_history.create_date',
  JOB_DATE = 'job_history.job_date',
}

@Injectable()
export abstract class JobHistoryBaseRepository extends BaseRepositoryContract<JobHistory, IJobHistoryQueryOptions> {
  constructor(
    @InjectRepository(JobHistory)
    protected readonly repository: Repository<JobHistory>,
    protected readonly pagination: Pagination
  ) {super(repository, pagination);}

  protected initializeDefaultOptions(
    options: IJobHistoryQueryOptions= {}
  ): Required<IJobHistoryQueryOptions> {
    return {
      filter: options.filter ?? new FilteringJobHistoryDto(),
      joinPallet: options.joinPallet ?? true,
      joinWarehouse: options.joinWarehouse ?? true,
      orderMap: options.orderMap ?? {},
    };
  }

  protected createQueryBuilder(
    options: IJobHistoryQueryOptions
  ): SelectQueryBuilder<JobHistory> {
    const { filter, joinPallet, joinWarehouse, orderMap } = this.initializeDefaultOptions(options);
    const queryBuilder = this.createJoinQueryBuilder(joinPallet, joinWarehouse);
    const filteredQb = this.makeFilteredQueryBuilder(queryBuilder, filter, {joinPallet, joinWarehouse});
    const orderedQb = this.makeOrderedQueryBuilder(filteredQb, orderMap);

    return orderedQb;
  }

  protected makeFilteredQueryBuilder(
    queryBuilder: SelectQueryBuilder<JobHistory>,
    filter: FilteringJobHistoryDto,
    join: {joinPallet: boolean, joinWarehouse: boolean},
  ): SelectQueryBuilder<JobHistory> {
    if (filter.jobHistoryId) {
      queryBuilder.andWhere('job_history.id = :id', { id: filter.jobHistoryId });
    }

    if (join?.joinPallet && filter.palletId) {
      queryBuilder.andWhere('pallet.id = :palletId', { palletId: filter.palletId });
    }

    if (join?.joinWarehouse && filter.warehouseId) {
      queryBuilder.andWhere('warehouse.id = :warehouseId', { warehouseId: filter.warehouseId });
    }

    if (filter.skuKey) {
      queryBuilder.andWhere('job_history.sku_key = :skuKey', { skuKey: filter.skuKey });
    }

    if (filter.standardType) {
      queryBuilder.andWhere('job_history.standard_type = :standardType', { standardType: filter.standardType });
    }

    if (filter.workingStatus) {
      queryBuilder.andWhere('job_history.working_status = :workingStatus', { workingStatus: filter.workingStatus });
    }

    if (filter.taskType) {
      queryBuilder.andWhere('job_history.task_type = :taskType', { taskType: filter.taskType });
    }

    if (filter.batchNumber) {
      queryBuilder.andWhere('job_history.batch_number LIKE :batchNumber', { batchNumber: `%${filter.batchNumber}%` });
    }

    if (filter.orderNumber) {
      queryBuilder.andWhere('job_history.order_number LIKE :orderNumber', { orderNumber: `%${filter.orderNumber}%` });
    }

    if (filter.jobStartDate && filter.jobEndDate) {
      queryBuilder.andWhere('job_history.job_date >= :startDate', { startDate: filter.jobStartDate })
      .andWhere('job_history.job_date <= :endDate', { endDate: filter.jobEndDate })
    } else if (filter.jobStartDate) {
      queryBuilder.andWhere('job_history.job_date >= :startDate', { startDate: filter.jobStartDate });
    } else if (filter.jobEndDate) {
      queryBuilder.andWhere('job_history.job_date <= :endDate', { endDate: filter.jobEndDate });
    }

    if (filter.warehouseType) {
      queryBuilder.andWhere('warehouse.type = :warehouseType', { warehouseType: filter.warehouseType });
    }


    return queryBuilder;
  }

  protected createJoinQueryBuilder(joinPallet: boolean = true, joinWarehouse: boolean = true): SelectQueryBuilder<JobHistory> {
    const queryBuilder = this.repository.createQueryBuilder('job_history')

    if (joinPallet) {
      queryBuilder.leftJoinAndSelect('job_history.pallet', 'pallet');
    }

    if (joinWarehouse) {
      queryBuilder.leftJoinAndSelect('job_history.warehouse', 'warehouse');
    }

    return queryBuilder;
  };
}