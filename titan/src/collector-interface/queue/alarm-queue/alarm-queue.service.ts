import { Logger, Injectable, InternalServerErrorException, BadRequestException } from '@nestjs/common';

import { Transactional } from 'typeorm-transactional';
import { AlarmQueueRepository } from './repositories/alarm-queue.repository';
import { SseService } from 'src/core/sse/sse.service';
import { DEBUG_QUEUE_TABLE_SEARCH } from 'src/config/debug.config';
import { SystemService } from 'src/domains/setting/system/system.service';
import { Alarm } from 'src/domains/alarm/alarm/entities/alarm.entity';
import { AlarmQueue } from './entities/alarm-queue.entity';
import { EquipmentAlarmHistoryService } from 'src/domains/alarm/history/alarm-history/sub-domain/equipment-alarm-history/equipment-alarm-history.service';
import { EquipmentAlarmHistory } from 'src/domains/alarm/history/alarm-history/sub-domain/equipment-alarm-history/entities/equipment-alarm-history.entity';
import { AlarmHistoryService } from 'src/domains/alarm/history/alarm-history/alarm-history.service';
import { UpdateProcessAlarmHistoryDto } from 'src/domains/alarm/history/alarm-history/dto/request/update-process-alarm-history.dto';
import { AlarmMessageDispatchService } from 'src/domains/alarm/alarm-message-dispatch/alarm-message-dispatch.service';
import { CreateAlarmSmsDto } from 'src/domains/alarm/alarm-message-dispatch/dto/create-alarm-sms.dto';
import { AlarmHistory } from 'src/domains/alarm/history/alarm-history/entities/alarm-history.entity';
import { FilteringEquipmentAlarmHistoryDto } from 'src/domains/alarm/history/alarm-history/sub-domain/equipment-alarm-history/dto/request/filtering-equipment-alarm-history.dto';
import { Equipment } from 'src/domains/equipment/equipment/entities/equipment.entity';
import { FilteringAlarmHistoryDto } from 'src/domains/alarm/history/alarm-history/dto/request/filtering-alarm-history.dto';
import { arrayToJsonFile } from 'src/utils/json.util';
import { SSE_EVENT_TYPE } from 'src/common/enum/sse.enum';
import { ALARM_HISTORY_PROCESS_FLAG } from 'src/common/enum/alarm.enum';
import { ORDER } from 'src/common/enum/db.enum';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EQUIPMENT_TYPE } from 'src/common/enum/equipment.enum';

@Injectable()
export class AlarmQueueService {
    private readonly logger = new Logger(AlarmQueueService.name)
    private isRunning = false;
    constructor(

    private readonly alarmQueueRepository: AlarmQueueRepository,
    private readonly equipAlarmHistoryService: EquipmentAlarmHistoryService,
    private readonly alarmHistoryService: AlarmHistoryService,
    private readonly sseService: SseService,
    private readonly systemService: SystemService,
    private readonly messageDispatchService: AlarmMessageDispatchService,
    private readonly eventEmitter: EventEmitter2,
  ) { }



  onModuleInit() {
    if(DEBUG_QUEUE_TABLE_SEARCH){
      this.scheduleTask();
    }
  }

  async createAlarmQueue(alarm: Alarm, equipment: Equipment, processStatus: number): Promise<AlarmQueue> {
    if (!alarm) {
      throw new BadRequestException('Alarm is required to create an AlarmQueue');
    }
    const alarmQueue = new AlarmQueue();
    alarmQueue.alarm = alarm;
    alarmQueue.process_status = processStatus;
    return await this.alarmQueueRepository.createAlarmQueue(equipment, alarmQueue);
  }

  //history에서 던지면 순환참조 발생. view에서 check 후 던지기. 
  private async scheduleTask() {
    if (this.isRunning) {
      this.logger.warn('Previous transferAlarmHistory still running, skipping...');
      return;
    }

    this.isRunning = true;

    try {
      const equipmentAhEntities = await this.popAlarmQueue();
      if (equipmentAhEntities && equipmentAhEntities.length > 0) {
        const system = await this.systemService.getSystem();
        if(system.equipment_alarm_enabled){
          const alarmHistoryIds: number[] = equipmentAhEntities.map(equipAHE => equipAHE.alarm_history.id);
          const ahEntities = await this.alarmHistoryService.getAlarmHistoryEntitiesByIds(alarmHistoryIds);
          this.sseService.sendEventToAll(SSE_EVENT_TYPE.ALARM_TRIGGER, alarmHistoryIds);
          //문자 전송
          for ( const ahEntity of ahEntities) {
            if (!ahEntity.equipment_alarm_history?.alarm?.manager_user_list) {
              continue;
            }
            
            const eahAlarm = ahEntity.equipment_alarm_history.alarm;
            const message = this.makeSMSMessage(ahEntity);

            for (const user of eahAlarm.manager_user_list!){
              if (user.phone_number) {
              
                const msgDispatchDto = new CreateAlarmSmsDto();
                msgDispatchDto.alarm_history_id = ahEntity.id;
                msgDispatchDto.message = message;
                msgDispatchDto.phone_number = user.phone_number;
                msgDispatchDto.users_seq_id = user.seq_id;

                await this.messageDispatchService.createAlarmSms(msgDispatchDto);
              } else {
                this.logger.warn(`User with ID ${user.user_id} does not have a phone number.`);
              }
            }
          }
          this.logger.debug(`Sent ${equipmentAhEntities.length} alarms via SSE`);
        }
      } else {
        //this.logger.debug('No new alarms to transfer');
      }
    } catch (err) {
      this.logger.error('Error during alarm transfer:', err.message);
    } finally {
      this.isRunning = false;
    }
    setTimeout(() => this.scheduleTask(), 1000);
  }

  private makeSMSMessage(ahEntity: AlarmHistory): string {
    const equipTypeName = ahEntity.equipment_alarm_history?.alarm?.equipment_type?.name;
    const alarmDesc = ahEntity.equipment_alarm_history?.alarm?.description;
    const ahMessage = ahEntity.message? ahEntity.message : '';
    
    const message = `An alarm has occurred.\r\nEquipment: ${equipTypeName}\r\nContents: ${alarmDesc}\r\nMessage: ${ahMessage}`;
    return message;
  }


  private async popAlarmQueue(): Promise<EquipmentAlarmHistory[]> {
    //1. 알람 큐 아무 내용 없으면 return 시킨다.
    const alarmQueueList = await this.alarmQueueRepository.getFilteredList();
    if (!alarmQueueList?.length) return [];

    //2. 알람 큐에서 process_status가 1인 것과 0인 것을 나눈다.
    const generatedAlarmList: AlarmQueue[] = [];    //발생 알람
    const completedAlarmList: AlarmQueue[] = [];    //완료 알람
    const errorList = [] as AlarmQueue[];
    const rstEquipmentAlarmHistoryEntities = [] as EquipmentAlarmHistory[];
    
    for (const alarmQueue of alarmQueueList) {
      // RGV 상태 처리
      if (alarmQueue.equipment.equipment_type.type === EQUIPMENT_TYPE.RGV) {
        this.eventEmitter.emit('alarm.queue.rgv', alarmQueue);
      }
      if (alarmQueue.process_status === 0) {
        completedAlarmList.push(alarmQueue);
      } else {
        generatedAlarmList.push(alarmQueue);
      } 
    }

    //3. 알람 큐에서 process_status가 1인 것들을 알람 이력으로 저장(인서트처리)한다.
    for (const alarmQueue of generatedAlarmList) {
      try {
        const newEquipmentAlarmHistory = await this.insertHistoryAndDeleteQueue(alarmQueue);
        rstEquipmentAlarmHistoryEntities.push(newEquipmentAlarmHistory);
      } catch (error) {
        errorList.push(alarmQueue);
        const isDeleted = await this.alarmQueueRepository.deleteAlarmQueue(alarmQueue.id);
        if (!isDeleted) {
          this.logger.warn(`Failed to delete AlarmQueue`);
          throw new InternalServerErrorException(`Failed to delete AlarmQueue`);
        }
      }
    }

    //4. 알람 큐에서 process_status가 0인 것들을 알람 이력으로 업데이트 처리한다.
    for (const alarmQueue of completedAlarmList) {
      try {
        const newEquipmentAlarmHistory = await this.updateHistoryAndDeleteQueue(alarmQueue);
        if (newEquipmentAlarmHistory) {
          rstEquipmentAlarmHistoryEntities.push(newEquipmentAlarmHistory);
        }
      } catch (error) {
        errorList.push(alarmQueue);
        const isDeleted = await this.alarmQueueRepository.deleteAlarmQueue(alarmQueue.id);
        if (!isDeleted) {
          this.logger.warn(`Failed to delete AlarmQueue`);
          throw new InternalServerErrorException(`Failed to delete AlarmQueue`);
        }
      }
    }

    if (errorList && errorList.length > 0) {
      await arrayToJsonFile(AlarmQueueService.name, errorList)
    }

    return rstEquipmentAlarmHistoryEntities;
  }

  @Transactional()
  private async insertHistoryAndDeleteQueue(alarmQueue: AlarmQueue): Promise<EquipmentAlarmHistory> {
    const newEquipmentAlarmHistory = await this.equipAlarmHistoryService.insertHistoryByAlarmQueue(alarmQueue);
    const isDeleted = await this.alarmQueueRepository.deleteAlarmQueue(alarmQueue.id);
    if (!isDeleted) {
      this.logger.warn(`Failed to delete AlarmQueue`);
      throw new InternalServerErrorException(`Failed to delete AlarmQueue`);
    }
    return newEquipmentAlarmHistory;
  }

  @Transactional()
  private async updateHistoryAndDeleteQueue(alarmQueue: AlarmQueue): Promise<EquipmentAlarmHistory | null> {
    let eaList = [] as EquipmentAlarmHistory[];
    const baseFilter = new FilteringAlarmHistoryDto();
    const filter = new FilteringEquipmentAlarmHistoryDto();
    filter.alarmId = alarmQueue.alarm?.id;
    filter.equipmentCode = alarmQueue.equipment.code;
    baseFilter.filteringEquipmentAlarmHistory = filter;
    // baseFilter.processType = ALARM_HISTORY_PROCESS_FLAG.ALL;
    baseFilter.processType = ALARM_HISTORY_PROCESS_FLAG.UNPROCESSED;
    const ahEntities = await this.alarmHistoryService.getFilteredEntities(baseFilter);
    if (ahEntities.length === 0) {
      this.logger.warn(`No alarm history for alarm id: ${alarmQueue.alarm.id}`);
      throw new InternalServerErrorException(`No alarm history for alarm id: ${alarmQueue.alarm.id}`);
    }

    for (const ahEntity of ahEntities) {
      if (ahEntity.process_date) {
        this.logger.warn(`Alarm history already processed for alarm id: ${alarmQueue.alarm.id}`);
        throw new InternalServerErrorException(`Alarm history already processed for alarm id: ${alarmQueue.alarm.id}`);
      }

      if (!ahEntity.equipment_alarm_history?.alarm?.id) {
        this.logger.warn(`Missing EAH/alarm for alarm id: ${alarmQueue.alarm.id}`);
        throw new InternalServerErrorException(`Missing EAH/alarm for alarm id: ${alarmQueue.alarm.id}`);
      }

      const updAH = new UpdateProcessAlarmHistoryDto();
      updAH.process_date = alarmQueue.create_date;
      updAH.process_message = 'Alarm completed.';
  
      const isSuccess = await this.alarmHistoryService.updateProcessAlarmHistory(
        ahEntity.id,
        updAH,
      );

      if (!isSuccess || isSuccess.isSuccess === false) {
        this.logger.warn(`Failed to update alarm history for alarm id: ${alarmQueue.alarm.id}`);
        throw new InternalServerErrorException(`Failed to update alarm history for alarm id: ${alarmQueue.alarm.id}`);
      }
  
    //무한 사슬 문제 발생 -> 직렬화 주의
    const equipmentAlarmHistory = ahEntity.equipment_alarm_history;
    equipmentAlarmHistory.alarm_history = ahEntity;
    eaList.push(equipmentAlarmHistory);
    }

    const isDeleted = await this.alarmQueueRepository.deleteAlarmQueue(alarmQueue.id);
    if (!isDeleted) {
      this.logger.warn(`Failed to delete AlarmQueue`);
      throw new InternalServerErrorException(`Failed to delete AlarmQueue`);
    }

    const latest = eaList.sort((a, b) => b.alarm_history!.create_date.getTime() - a.alarm_history!.create_date.getTime())[0];
    return latest;
  }
};