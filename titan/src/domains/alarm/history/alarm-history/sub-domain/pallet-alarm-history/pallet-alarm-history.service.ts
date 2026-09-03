import { Logger, Injectable } from '@nestjs/common';
import { CreateAlarmHistoryDto } from '../../dto/request/create-alarm-history.dto';
import { AlarmHistoryService } from '../../alarm-history.service';
import { PalletAlarmHistoryRepository } from './repositories/pallet-alarm-history.repository';
import { PalletAlarmHistory } from './entities/pallet-alarm-history.entity';
import { CreatePalletAlarmHistoryDto } from './dto/request/create-pallet-alarm-history.dto';
import { ALARM_HISTORY_TYPE } from 'src/common/enum/alarm.enum';

@Injectable()
export class PalletAlarmHistoryService {
    private readonly logger = new Logger(PalletAlarmHistoryService.name)
    constructor(
    private readonly alarmHistoryService: AlarmHistoryService,
    private readonly pahRepository: PalletAlarmHistoryRepository,
  ) {}

  onModuleInit() {
  }

  async createPalletAlarmHistory(createDto : CreatePalletAlarmHistoryDto) : Promise<PalletAlarmHistory>{
    const createAlarmHistoryDto = createDto as CreateAlarmHistoryDto;
    createAlarmHistoryDto.type = ALARM_HISTORY_TYPE.PALLET;
    const alarmHistory = await this.alarmHistoryService.createAlarmHistory(createAlarmHistoryDto)
    const palletAlarmHistory = await this.pahRepository.createPalletAlarmHistory(alarmHistory, createDto);
    return palletAlarmHistory;
  }
};