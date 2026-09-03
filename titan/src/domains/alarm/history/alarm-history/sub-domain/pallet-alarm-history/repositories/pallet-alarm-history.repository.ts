import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { AlarmHistory } from '../../../entities/alarm-history.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PalletAlarmHistory } from '../entities/pallet-alarm-history.entity';
import { CreatePalletAlarmHistoryDto } from '../dto/request/create-pallet-alarm-history.dto';
 
@Injectable()
export class PalletAlarmHistoryRepository {
  constructor(
    @InjectRepository(PalletAlarmHistory)
    private readonly repository: Repository<PalletAlarmHistory>,
  ) {}

  async createPalletAlarmHistory(alarmHistory: AlarmHistory, createDto: CreatePalletAlarmHistoryDto): Promise<PalletAlarmHistory> {
    const newAlarmHistory = this.repository.create({alarm_history : alarmHistory, ...createDto});
    return await this.repository.save(newAlarmHistory);
  }

  
}
