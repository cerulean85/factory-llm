import { Logger, Injectable } from '@nestjs/common';
import { CreateAlarmHistoryDto } from '../../dto/request/create-alarm-history.dto';
import { AlarmHistoryService } from '../../alarm-history.service';
import { AlarmHistory } from '../../entities/alarm-history.entity';
import { InventoryAlarmHistoryRepository } from './repositories/inventory-alarm-history.repository';
import { CreateInventoryAlarmHistoryDto } from './dto/request/create-inventory-alarm-history.dto';
import { InventoryAlarmHistory } from './entities/inventory-alarm-history.entity';
import { FilteringInventoryAlarmHistoryDto } from './dto/request/filtering-inventory-alarm-history.dto';
import { AlarmHistoryBaseOrderKey } from '../../repositories/alarm-history.base.repository';
import { ORDER } from 'src/common/enum/db.enum';
import { ALARM_HISTORY_TYPE } from 'src/common/enum/alarm.enum';

@Injectable()
export class InventoryAlarmHistoryService {
    private readonly logger = new Logger(InventoryAlarmHistoryService.name)
    constructor(
    private readonly alarmHistoryService: AlarmHistoryService,
    private readonly iahRepository: InventoryAlarmHistoryRepository,
  ) {}

  async createInventoryAlarmHistory(createDto : CreateInventoryAlarmHistoryDto) : Promise<InventoryAlarmHistory>{
    const createAlarmHistoryDto = createDto as CreateAlarmHistoryDto;
    createAlarmHistoryDto.type = ALARM_HISTORY_TYPE.INVENTORY;
    const alarmHistory = await this.alarmHistoryService.createAlarmHistory(createAlarmHistoryDto)
    const inventoryAlarmHistory = await this.iahRepository.createInventoryAlarmHistory(alarmHistory, createDto);
    return inventoryAlarmHistory;
  }

};