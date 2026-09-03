import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pagination } from 'src/utils/pagination.util';
import { Users } from 'src/domains/users/users/entities/users.entity';
import { AlarmHistoryProcessByUser } from '../entities/alarm-history-process-by-user.entity';
import { AlarmHistory } from '../../alarm-history/entities/alarm-history.entity';
import { AlarmHistoryProcessByUserBaseRepository } from './alarm-history-process-by-user.base.repository';

@Injectable()
export class AlarmHistoryProcessByUserRepository extends AlarmHistoryProcessByUserBaseRepository {
  private readonly logger = new Logger(AlarmHistoryProcessByUserRepository.name)
  constructor(
    @InjectRepository(AlarmHistoryProcessByUser)
    repository: Repository<AlarmHistoryProcessByUser>,
    pagination: Pagination,
  ) {super(repository, pagination);}

  async createRelation(user: Users, alarmHistosry: AlarmHistory): Promise<AlarmHistoryProcessByUser> {
    let newRelation = await this.checkRelation(user.seq_id, alarmHistosry.id);
    if(!newRelation) {
      const newData = this.repository.create({
        users: user,
        alarm_history: alarmHistosry
      });
      newRelation = await this.repository.save(newData);
    }
    return newRelation;
  }

  async bulkCreateRelations(users: Users[], alarmHistory: AlarmHistory): Promise<AlarmHistoryProcessByUser[]> {
    const entities = users.map(user => this.repository.create({ users:user, alarm_history: alarmHistory }));
    return this.repository.save(entities);
  }

  async checkRelation(userSeqId : number, alarmHistoryId: number) : Promise<AlarmHistoryProcessByUser | null>{
    if (userSeqId == null || alarmHistoryId == null) {
      throw new BadRequestException('userSeqId and alarmHistoryId must not be null');
    }
    const relation = await this.repository.findOne({
      where: {
        users: { seq_id: userSeqId },
        alarm_history: { id: alarmHistoryId },
      },
    });

    return relation; 
  }

  async deleteRelation(
    alarmHistoryId?: number,
    userSeqId?: number
  ): Promise<boolean> {
    try {
      const where: any = {};
      if (alarmHistoryId !== undefined) {
        where.alarm_history = { id: alarmHistoryId };
      }
      if (userSeqId !== undefined) {
        where.users = { seq_id: userSeqId };
      }

      if (Object.keys(where).length === 0) {
        throw new Error('At least one condition (alarmHistoryId or userSeqId) must be provided');
      }

      const { affected } = await this.repository.delete(where);
      return (affected ?? 0) > 0;
    } catch (error) {
      this.logger.error('Error deleting alarm-history-process-by-user relation:', error);
      throw error;
    }
}
}