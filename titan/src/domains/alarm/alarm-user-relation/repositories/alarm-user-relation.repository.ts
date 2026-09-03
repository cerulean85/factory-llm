import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository, SelectQueryBuilder, Transaction } from 'typeorm';
import { AlarmUserRelation } from '../entities/alarm-user-relation.entity';
import { Pagination } from 'src/utils/pagination.util';
import { Users } from 'src/domains/users/users/entities/users.entity';
import { Alarm } from 'src/domains/alarm/alarm/entities/alarm.entity';
import { AlarmUserRelationBaseRepository } from './alarm-user-relation.base.repository';

@Injectable()
export class AlarmUserRelationRepository extends AlarmUserRelationBaseRepository {
  constructor(
    @InjectRepository(AlarmUserRelation)
    repository: Repository<AlarmUserRelation>,
    pagination: Pagination,
  ) {super(repository, pagination);}

  async createAlarmUserRelation(user: Users, alarm: Alarm): Promise<AlarmUserRelation> {
    let newAlarmUserRelation = await this.checkAlarmUserRelation(user.seq_id, alarm.id);
    if(!newAlarmUserRelation) {
      const newRelation = this.repository.create({
        users: user,
        alarm: alarm
      });
      newAlarmUserRelation = await this.repository.save(newRelation);
    }
    return newAlarmUserRelation;
  }

  async checkAlarmUserRelation(userSeqId : number, alarmId: number) : Promise<AlarmUserRelation | null>{
    if (userSeqId == null || alarmId == null) {
      throw new BadRequestException('userSeqId and alarmId must not be null');
    }
    const relation = await this.repository.findOne({
      where: {
        users: { seq_id: userSeqId },
        alarm: { id: alarmId },
      },
    });

    return relation; 
  }

  async deleteAlarmUserRelationByAlarmId(alarmIdList: number[]): Promise<boolean> {
    const result = await this.repository.delete({ alarm: { id: In(alarmIdList) } });
    return result ? true : false;
  }

  async deleteAlarmUserRelationByUserSeqId(userSeqId: number): Promise<boolean> {
    const result = await this.repository.delete({ users: { seq_id: userSeqId } });
    return result ? true : false;
  }

  async deleteAlarmUserRelation(alarmId: number, userSeqId: number): Promise<boolean> {
    const result = await this.repository.delete({ alarm: { id: alarmId }, users: { seq_id: userSeqId } });
    return result ? true : false;
  }
}