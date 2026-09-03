import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { AlarmQueue } from '../entities/alarm-queue.entity';
import { AlarmQueueBaseRepository } from './alarm-queue.base.repository';
import { Pagination } from 'src/utils/pagination.util';
import { Equipment } from 'src/domains/equipment/equipment/entities/equipment.entity';

@Injectable()
export class AlarmQueueRepository extends AlarmQueueBaseRepository {
  constructor(
    @InjectRepository(AlarmQueue)
    repository: Repository<AlarmQueue>,
    pagination: Pagination
  ) {super(repository, pagination);}

  async createAlarmQueue(equipment: Equipment, alarmQueue: AlarmQueue): Promise<AlarmQueue> {
    const newAlarmQueue = this.repository.create({
      ...alarmQueue,
      equipment: equipment,
    });
    return await this.repository.save(newAlarmQueue);
  }

  async deleteAlarmQueueList(alarmQueueIds: number[]): Promise<boolean> {
    if (alarmQueueIds.length === 0) {
      return false;
    }
    const result = await this.repository.delete({ id: In(alarmQueueIds) });
    return result.affected !== undefined && result.affected !== null && result.affected > 0;
  }

  async deleteAlarmQueue(alarmQueueId: number): Promise<boolean> {
    const result = await this.repository.delete({ id: alarmQueueId });
    return result.affected !== undefined && result.affected !== null && result.affected > 0;
  }
}