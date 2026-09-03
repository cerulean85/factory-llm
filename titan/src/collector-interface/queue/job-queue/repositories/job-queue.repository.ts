import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository, SelectQueryBuilder  } from 'typeorm';
import { JobQueue } from '../entities/job-queue.entity';
import { JobQueueBaseRepository } from './job-queue.base.repository';
import { Pagination } from 'src/utils/pagination.util';

@Injectable()
export class JobQueueRepository extends JobQueueBaseRepository {
  constructor(
    @InjectRepository(JobQueue)
    repository: Repository<JobQueue>,
    pagination: Pagination
  ) {super(repository, pagination);}

  async createJobQueue(jobQueue: JobQueue): Promise<JobQueue> {
    const newJobQueue = this.repository.create(jobQueue);
    return await this.repository.save(newJobQueue);
  }

  async deleteJobQueueList(jobQueueIds: number[]): Promise<boolean> {
    if (jobQueueIds.length === 0) {
      return false;
    }  
    const result = await this.repository.delete({ id: In(jobQueueIds) });
    return result.affected !== undefined && result.affected !== null && result.affected > 0;
  }

  async deleteJobQueue(jobQueueId: number): Promise<boolean> {
    const result = await this.repository.delete({ id: jobQueueId });
    return result.affected !== undefined && result.affected !== null && result.affected > 0;
  }
}