import { Logger, Injectable, NotFoundException } from '@nestjs/common';
import { RealtimeEquipmentViewRepository } from './repositories/realtime-equipment-view.repository';
import { RealtimeEquipmentViewResponseDto } from './dto/response/realtime-equipment-view-response.dto';
import { FilteringRealtimeEquipmentViewDto } from './dto/request/filtering-realtime-equipment-view.dto';
import { plainToInstance } from 'class-transformer';
import { DEBUG_VIEW_TABLE_SEARCH } from 'src/config/debug.config';
import { RealtimeEquipmentView } from './entities/realtime-equipment-view.entity';
import { CreateRealtimeEquipmentViewDto } from './dto/request/create-realtime-equipment-view.dto';
import { EquipmentService } from 'src/domains/equipment/equipment/equipment.service';
import { SseService } from 'src/core/sse/sse.service';
import { EQUIPMENT_TYPE, OPERATION_STATUS } from 'src/common/enum/equipment.enum';
import { CreateEquipmentOperationHistoryDto } from 'src/domains/equipment/equipment-operation-history/dto/request/create-equipment-operation-history.dto';
import { EquipmentOperationHistoryService } from 'src/domains/equipment/equipment-operation-history/equipment-operation-history.service';
import { SSE_EVENT_TYPE } from 'src/common/enum/sse.enum';
import { OnEvent } from '@nestjs/event-emitter';
import { AlarmQueue } from 'src/collector-interface/queue/alarm-queue/entities/alarm-queue.entity';
import { GANTRY_STATUS, SC_STATUS, RGV_STATUS } from 'src/config/equipment.config';

@Injectable()
export class RealtimeEquipmentViewService {
  private readonly logger = new Logger(RealtimeEquipmentViewService.name)
  private isRunning = false;
  private static checkingViewMap = new Map<number, OPERATION_STATUS>();  // equipment_id - status
  private static equipmentIdTypeMap = new Map<number, EQUIPMENT_TYPE>();
  private static rgvFaultStatus = new Map<number, boolean>();
  
  constructor(
    private readonly repository: RealtimeEquipmentViewRepository,
    private readonly equipmentService: EquipmentService,
    private readonly sseService: SseService,
    private readonly equipmentOperationHistoryService: EquipmentOperationHistoryService,
  ) {
    this.initializeCheckingMap();
    this.initializeEquipmentMap();
  }

  onModuleInit() {
    if(DEBUG_VIEW_TABLE_SEARCH){
      this.scheduleTask();
    }
  }

  private async initializeCheckingMap() {
    try {
      const viewList = await this.getRealtimeViewEntities();
      viewList.forEach(view => {
        if (!RealtimeEquipmentViewService.checkingViewMap.has(view.equipment.id)) {
          if (!view.status || !(view.status in OPERATION_STATUS)) {
            view.status = OPERATION_STATUS.UNKNOWN;
          }
          RealtimeEquipmentViewService.checkingViewMap.set(view.equipment.id, view.status as OPERATION_STATUS);
        }
      })
    } catch (error) {
      this.logger.error('Failed to initialize checkingMap:', error);
    }
  }

  private async initializeEquipmentMap() {
    try {
      const equipmentList = await this.equipmentService.getFilteredEquipmentEntities();
      equipmentList.forEach(item => {
        RealtimeEquipmentViewService.equipmentIdTypeMap.set(item.id, item.equipment_type.type as EQUIPMENT_TYPE);
        if (item.equipment_type.type === EQUIPMENT_TYPE.RGV) {
          RealtimeEquipmentViewService.rgvFaultStatus.set(item.id, false);
        }
      })
    } catch (error) {
      this.logger.error('Failed to initialize equipmentIdTypeMap:', error);
    }
  }

  async createRealtimeView(createDto: CreateRealtimeEquipmentViewDto): Promise<RealtimeEquipmentView> {
    const { equipment_id : equipmentId, ...rest } = createDto;
    const equipment = equipmentId ? await this.equipmentService.getEquipmentById(equipmentId) : undefined;
    const realtimeView = await this.repository.createRealtimeEquipmentView(equipment, createDto);
    return realtimeView;
  }

  async getRealtimeViewEntities(filterDto: FilteringRealtimeEquipmentViewDto = new FilteringRealtimeEquipmentViewDto()): Promise<RealtimeEquipmentView[]> {
    const realtimeViewData = await this.repository.getFilteredList({ filter: filterDto });
    return realtimeViewData;
  }

  async getRealtimeViewList(filterDto: FilteringRealtimeEquipmentViewDto = new FilteringRealtimeEquipmentViewDto()): Promise<RealtimeEquipmentViewResponseDto[]> {
    const realtimeViewData = await this.repository.getFilteredList({ filter: filterDto });
    const transformedViewList = await this.checkViewStatus(realtimeViewData);
    const result = plainToInstance(RealtimeEquipmentViewResponseDto, transformedViewList, { excludeExtraneousValues: true });
    return result;
  }

  async getRealtimeViewById(filterDto: FilteringRealtimeEquipmentViewDto): Promise<RealtimeEquipmentViewResponseDto> {
    const realtimeViewData = await this.repository.getFilteredOne({ filter: filterDto });
    if (!realtimeViewData) {
      throw new NotFoundException('Realtime View not found');
    }
    const transformedViewList = await this.checkViewStatus([realtimeViewData]);
    const result = plainToInstance(RealtimeEquipmentViewResponseDto, transformedViewList[0], { excludeExtraneousValues: true });
    return result;
  }

  private async scheduleTask() {
    if (this.isRunning) {
      this.logger.warn('Previous Realtime View still running, skipping...');
      return;
    }
    this.isRunning = true;

    try {
      const viewList = await this.getRealtimeViewEntities();
      const transformedViewList = await this.checkViewStatus(viewList);
      this.sseService.sendEventToAll(SSE_EVENT_TYPE.REALTIME_EQUIPMENT_VIEW, transformedViewList);
    } catch (error) {
      this.logger.error('Error during realtime view schedule task:', error.message);
    } finally {
      this.isRunning = false;
    }
    setTimeout(() => this.scheduleTask(), 1000);
  }

  private async checkViewStatus(viewList: RealtimeEquipmentView[]) {
    const transformedViewList = viewList.map(view => ({
      ...view,
      status: this.mapEquipmentStatus(view, RealtimeEquipmentViewService.equipmentIdTypeMap)
    }));
    transformedViewList.forEach(async view => {
      let currentStatus = RealtimeEquipmentViewService.checkingViewMap.get(view.equipment.id);
      let newStatus = view.status as OPERATION_STATUS;

      if (newStatus !== currentStatus) {
        RealtimeEquipmentViewService.checkingViewMap.set(view.equipment.id, newStatus);
        await this.insertEquipmentOperationHistory(view);
      }
    })
    return transformedViewList;
  }

  private mapEquipmentStatus(view: RealtimeEquipmentView, equipmentIdTypeMap: Map<number, EQUIPMENT_TYPE>) {
    const MAP_NUMBER_TO_STATUS = (statusMap: Map<OPERATION_STATUS, number[]>) => {
      const newMap = new Map<number, OPERATION_STATUS>();
      for (const [status, numbers] of statusMap.entries()) {
        numbers.forEach(num => newMap.set(num, status));
      }
      return newMap;
    }

    const equipmentType = equipmentIdTypeMap.get(view.equipment.id);
    let status: OPERATION_STATUS = OPERATION_STATUS.UNKNOWN;
    const statusNumber = typeof view.status === 'string' ? parseInt(view.status) : view.status as number;
    
    if (equipmentType === EQUIPMENT_TYPE.GTR) {
      const NUMBER_TO_STATUS = MAP_NUMBER_TO_STATUS(GANTRY_STATUS);
      status = NUMBER_TO_STATUS.get(statusNumber) ?? OPERATION_STATUS.START;
    }
    else if (equipmentType === EQUIPMENT_TYPE.STC) {
      const NUMBER_TO_STATUS = MAP_NUMBER_TO_STATUS(SC_STATUS);
      status = NUMBER_TO_STATUS.get(statusNumber) ?? OPERATION_STATUS.UNKNOWN;
    }
    else if (equipmentType === EQUIPMENT_TYPE.RGV) {
      const isFault = RealtimeEquipmentViewService.rgvFaultStatus.get(view.equipment.id);
      if (isFault) {
        status = OPERATION_STATUS.FAULT;
      } else {
        const NUMBER_TO_STATUS = MAP_NUMBER_TO_STATUS(RGV_STATUS);
        status = NUMBER_TO_STATUS.get(statusNumber) ?? OPERATION_STATUS.START;  
      }
    }
    
    if (status === OPERATION_STATUS.UNKNOWN) {
      status = RealtimeEquipmentViewService.checkingViewMap.get(view.equipment.id) as OPERATION_STATUS;
    }
    return status;
  }

  private async insertEquipmentOperationHistory(view: RealtimeEquipmentView) {
    const dto = new CreateEquipmentOperationHistoryDto();
    dto.equipment_id = view.equipment.id;
    dto.operation_status = view.status as OPERATION_STATUS;
    dto.create_date = view.create_date;
    dto.description = '';
    const newEquipmentOperationHistory = await this.equipmentOperationHistoryService.createEquipmentOperationHistory(dto);
    return newEquipmentOperationHistory;
  }

  private numberToBinary9Digits(num: number): string {
    return num.toString(2).padStart(9, '0');
  }

  private defineRgvStatus(num: number): OPERATION_STATUS {
    const binaryString = this.numberToBinary9Digits(num);

    if (binaryString[1] === '1') {
      if (binaryString[2] === '1') {
        return OPERATION_STATUS.UNKNOWN;
      }
      return OPERATION_STATUS.STOP;
    }
    return OPERATION_STATUS.START;
  }

  @OnEvent('alarm.queue.rgv', { async: true })
  private async handleRgvStatus(alarmQueue: AlarmQueue) {
    const isFault = alarmQueue.process_status === 1;
    if (!RealtimeEquipmentViewService.rgvFaultStatus.has(alarmQueue.equipment.id)) {
      this.logger.warn(`RGV Fault Status not found for equipment ${alarmQueue.equipment.id}`);
    } else {
      RealtimeEquipmentViewService.rgvFaultStatus.set(alarmQueue.equipment.id, isFault);
    }
  }
};