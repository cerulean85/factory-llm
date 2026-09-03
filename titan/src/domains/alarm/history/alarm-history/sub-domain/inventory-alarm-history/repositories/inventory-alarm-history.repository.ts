import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Pagination } from 'src/utils/pagination.util';
import { AlarmHistory } from '../../../entities/alarm-history.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { AlarmHistoryBaseRepository } from '../../../repositories/alarm-history.base.repository';
import { InventoryAlarmHistory } from '../entities/inventory-alarm-history.entity';
import { CreateInventoryAlarmHistoryDto } from '../dto/request/create-inventory-alarm-history.dto';
 
@Injectable()
export class InventoryAlarmHistoryRepository {
  constructor(
    @InjectRepository(InventoryAlarmHistory)
    private readonly repository: Repository<InventoryAlarmHistory>,
  ) {}

  async createInventoryAlarmHistory(alarmHistory: AlarmHistory, createDto :CreateInventoryAlarmHistoryDto ): Promise<InventoryAlarmHistory> {
    const newAlarmHistory = this.repository.create({alarm_history : alarmHistory, ...createDto });
    return await this.repository.save(newAlarmHistory);
  }

  
}
