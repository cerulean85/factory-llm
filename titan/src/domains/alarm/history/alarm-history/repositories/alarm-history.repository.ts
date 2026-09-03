import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AlarmHistory } from '../entities/alarm-history.entity';
import { Pagination } from 'src/utils/pagination.util';
import { CreateAlarmHistoryDto } from '../dto/request/create-alarm-history.dto';
import { UpdateAlarmHistoryDto } from '../dto/request/update-alarm-history.dto';
import { AlarmHistoryBaseRepository } from './alarm-history.base.repository';
 
@Injectable()
export class AlarmHistoryRepository extends AlarmHistoryBaseRepository{
  constructor(
    @InjectRepository(AlarmHistory)
    repository: Repository<AlarmHistory>,

    pagination: Pagination,
  ) {super(repository, pagination)}

  async createAlarmHistory(createAlarmHistoryDto: CreateAlarmHistoryDto): Promise<AlarmHistory> {
    const newAlarmHistory = this.repository.create(createAlarmHistoryDto);
    return await this.repository.save(newAlarmHistory);
  }
  async insertAlarmHistory(alarmHistoryList: AlarmHistory): Promise<AlarmHistory> {
    return await this.repository.save(alarmHistoryList);
  }

  async insertAlarmHistoryList(alarmHistoryList: AlarmHistory[]): Promise<AlarmHistory[]> {
    return await this.repository.save(alarmHistoryList);
  }


  async updateProcess(alarmHistoryId: number, processMessage: string, processDate: Date = new Date()): Promise<boolean> {
    try {
      //update_date가 자동으로 업데이트 되지 않는 typeORM의 버그!
      const result = await this.repository.update(alarmHistoryId, {
        process_date: processDate,
        process_message: processMessage,
        update_date: new Date(),
      });
      return result.affected !== undefined && result.affected !== null && result.affected > 0;

    } catch (error) {
      throw new InternalServerErrorException('DB Connection Error');
    }
  } 


  async updateAlarmHistory(alarmHistory: AlarmHistory, updateAlarmHistoryDto?: UpdateAlarmHistoryDto): Promise<boolean> {
    this.repository.merge(alarmHistory, {
      ...updateAlarmHistoryDto
    });

    const result =  await this.repository.save(alarmHistory);
    return result ? true : false;
  }


  async updateProcessMessage(alarmHistoryId: number, processMessage: string, processDate: Date = new Date()): Promise<boolean> {
    try {
      // const entity = await this.alarmHistoryRepo.findOneByOrFail({ id: alarmHistoryId });
      // entity.process_date = processDate;
      // entity.process_message = processMessage;

      //update_date가 자동으로 업데이트 되지 않는 typeORM의 버그!
      const result = await this.repository.update(alarmHistoryId, {
        process_date: processDate,
        process_message: processMessage,
        update_date: new Date(),
      });
      return result.affected !== undefined && result.affected !== null && result.affected > 0;

    } catch (error) {
      throw new InternalServerErrorException('DB Connection Error');
    }
  } 
}
