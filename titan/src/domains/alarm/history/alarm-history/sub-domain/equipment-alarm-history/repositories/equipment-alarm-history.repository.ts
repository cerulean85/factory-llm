import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Pagination } from 'src/utils/pagination.util';
import { EquipmentAlarmHistory } from '../entities/equipment-alarm-history.entity';
import { Alarm } from 'src/domains/alarm/alarm/entities/alarm.entity';
import { AlarmHistory } from '../../../entities/alarm-history.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { AlarmHistoryBaseRepository } from '../../../repositories/alarm-history.base.repository';
import { CreateEquipmentAlarmHistoryDto } from '../dto/request/create-equipment-alarm-history.dto';
 
@Injectable()
export class EquipmentAlarmHistoryRepository {
  constructor(
    @InjectRepository(EquipmentAlarmHistory)
    private readonly repository: Repository<EquipmentAlarmHistory>,
  ) {}

  async createEquipmentAlarmHistory(alarm: Alarm, alarmHistory: AlarmHistory, createDto: CreateEquipmentAlarmHistoryDto): Promise<EquipmentAlarmHistory> {
    const newEquipmentAlarmHistory = this.repository.create({...createDto, alarm : alarm, alarm_history : alarmHistory });
    return await this.repository.save(newEquipmentAlarmHistory);
  }

  async getEquipmentAlarmHistoryById(equipmentAlarmHistoryId: number): Promise<EquipmentAlarmHistory | null> {
    const result = await this.repository.findOne({where: {id: equipmentAlarmHistoryId}, relations: ['alarm_history']});
    return result;
  }
}
