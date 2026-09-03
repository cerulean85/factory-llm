import { ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { EquipmentOperationHistory } from './entities/equipment-operation-history.entity';
import { EquipmentOperationHistoryRepository } from './repositories/equipment-operation-history.repository';
import { EquipmentService } from '../equipment/equipment.service';
import { CreateEquipmentOperationHistoryDto } from './dto/request/create-equipment-operation-history.dto';
import { PaginationRequestDto } from 'src/common/dto/pagination-request.dto';
import { PaginationResponseDto } from 'src/common/dto/pagination-response.dto';
import { FilteringEquipmentOperationHistoryDto } from './dto/request/filtering-equipment-operation-history.dto';
import { EquipmentOperationHistoryAggregationDto, OperationDetail } from './dto/response/equipment-operation-history-aggregation.dto';
import { ORDER } from 'src/common/enum/db.enum';
import { EQUIPMENT_TYPE, OPERATION_MAINTENANCE_TYPE, OPERATION_STATUS } from 'src/common/enum/equipment.enum';
import { EquipmentResponseDto } from '../equipment/dto/response/equipment-response.dto';
import { ResponseStatusDto } from 'src/common/dto/response-status.dto';
import { UpdateEquipmentOperationHistoryDto } from './dto/request/update-equipment-operation-history.dto';
import { DateTimeMinSplit, DateTimeSplit, InitEndOfDay, InitStartOfDay } from 'src/utils/date-transform.util';
import { EquipmentOperationHistoryOrderKey } from './repositories/equipment-operation-history.base.repository';
import { DEBUG_VIEW_TABLE_SEARCH } from 'src/config/debug.config';
import { EquipmentOperationCurrentStatusResponseDto } from './dto/response/equipment-operation-current-status-response.dto';
import { SSE_EVENT_TYPE } from 'src/common/enum/sse.enum';
import { FilteringEquipmentDto } from '../equipment/dto/request/filtering-equipment.dto';
import { plainToInstance } from 'class-transformer';
import { EquipmentOperationHistoryStatsRepository, OperationDetailRaw } from './repositories/equipment-operation-history.stats.repository';
import { strToEnum } from 'src/utils/data-transform.util';

@Injectable()
export class EquipmentOperationHistoryService {
  private readonly logger = new Logger(EquipmentOperationHistoryService.name)
  private isRunning = false;
  sseService: any;
  constructor(
    private readonly equipmentOperationHistoryRepository: EquipmentOperationHistoryRepository,
    private readonly equipmentOperationHistoryStatsRepository: EquipmentOperationHistoryStatsRepository,
    private readonly equipmentService: EquipmentService
  ) {}

  onModuleInit() {
    if (!DEBUG_VIEW_TABLE_SEARCH) {
      this.scheduleTask();
    }
  }

  private async scheduleTask() {
    if (this.isRunning) {
      this.logger.warn('Previous RealtimeEquipmentOperationService task is still running. Skipping...');
      return;
    }
    this.isRunning = true;

    try {
      const startDate = InitStartOfDay(new Date()).toString();
      const endDate = InitEndOfDay(new Date()).toString();
      const result = await this.getEquipmentOperationStats(startDate, endDate);

      const currentStatusList = [] as EquipmentOperationCurrentStatusResponseDto[];

      result.forEach(element => {
        const currentStatus = new EquipmentOperationCurrentStatusResponseDto();
        currentStatus.equipmentCode = element.equipmentCode;
        currentStatus.runningState = element.currentOperationStatus;
        currentStatus.errorCode = '';
        currentStatus.errorDesc = '';

        currentStatusList.push(currentStatus);
      });

      this.sseService.sendEventToAll(SSE_EVENT_TYPE.CURRENT_EQUIPMENT_OPERATION, currentStatusList);

    } catch (error) {
      this.logger.error('Error in RealtimeWarehouseViewService scheduled task', error.message);
    } finally {
      this.isRunning = false;
    }
    setTimeout(() => this.scheduleTask(), 1000);
  }



  async createEquipmentOperationHistory(dto: CreateEquipmentOperationHistoryDto) : Promise<EquipmentOperationHistory> {
    const { equipment_id: equipmentId} = dto;
    const equipment = await this.equipmentService.getEquipmentById(equipmentId) ?? undefined;
    if (!equipment) {
      this.logger.warn(`Equipment not found : ${equipmentId}`);
      throw new NotFoundException(`Equipment not found : ${equipmentId}`);
    };

    const rawResult = await this.equipmentOperationHistoryRepository.createEquipmentOperationHistory(equipment, dto);
    return rawResult;
  };

  async getPagination(paginationRequest: PaginationRequestDto): Promise<PaginationResponseDto<EquipmentOperationHistory>> {
    const result = await this.equipmentOperationHistoryRepository.getFilteredPaginatedList({filter : paginationRequest as FilteringEquipmentOperationHistoryDto});
    return result;
  };

  async updateEquipmentOperationHistory(equipmentOperationHistoryId: number, dto: UpdateEquipmentOperationHistoryDto): Promise<ResponseStatusDto> {
    const filterDto = new FilteringEquipmentOperationHistoryDto();
    filterDto.equipmentOperationHistoryId = equipmentOperationHistoryId;
    const equipmentOperationHistory = await this.equipmentOperationHistoryRepository.getFilteredOne({filter: filterDto});
    if (!equipmentOperationHistory) {
      this.logger.warn(`EquipmentOperationHistory not found : ${equipmentOperationHistoryId}`);
      throw new NotFoundException(`EquipmentOperationHistory not found : ${equipmentOperationHistoryId}`);
    }
    const result = await this.equipmentOperationHistoryRepository.updateEquipmentOperationHistory(equipmentOperationHistory, dto);
    let resStatusDto = new ResponseStatusDto();
    resStatusDto.isSuccess = result;
    resStatusDto.message = result ? 'EquipmentOperationHistory updated successfully.' : 'Failed to update EquipmentOperationHistory.';
    return resStatusDto;
  }

  async getEquipmentOperationStats(startDate:string, endDate:string) : Promise<EquipmentOperationHistoryAggregationDto[]> {
    const oprStatsList = await this.equipmentOperationHistoryStatsRepository.getEquipmentOperationAggregation(startDate, endDate);
    const oprDetailList = await this.equipmentOperationHistoryStatsRepository.getOperationDetail(startDate, endDate);
    const groupedDetail = oprDetailList.reduce((acc, d) => {
      if (!acc[d.equipment_id]) {
        acc[d.equipment_id] = [];
      }
      acc[d.equipment_id].push(d);
      return acc;
    }, {} as Record<number, OperationDetailRaw[]>);


    const aggDtoList = [] as EquipmentOperationHistoryAggregationDto[];
    for(const stats of oprStatsList){
      const aggDto = new EquipmentOperationHistoryAggregationDto();
      const oprDetailList = [] as OperationDetail[];
      const detailList = groupedDetail[stats.equipment_id] ?? []

      for(const detail of detailList){
        const oprDetail = new OperationDetail();
        oprDetail.startDate = detail.seg_from;
        oprDetail.endDate = detail.seg_to;
        oprDetail.operationStatus = strToEnum(detail.status, OPERATION_STATUS, OPERATION_STATUS.UNKNOWN);
        oprDetail.durationMin = detail.minutes;
        oprDetail.equipmentOperationHistoryId = detail.equipment_operation_history_id?? -1;
        oprDetail.operationMaintenanceType = strToEnum(detail.operation_maintenance_type, OPERATION_MAINTENANCE_TYPE, OPERATION_MAINTENANCE_TYPE.DEFAULT)
        oprDetail.description = detail.description?? '';
        oprDetailList.push(oprDetail);
      }

      aggDto.equipmentId = stats.equipment_id;
      aggDto.equipmentName = stats.equipment_name;
      aggDto.equipmentCode = stats.equipment_code;
      aggDto.equipmentTypeId = stats.equipment_type_id;
      aggDto.equipmentTypeName = stats.equipment_type_name;
      aggDto.currentOperationStatus = strToEnum(stats.current_status_at_now, OPERATION_STATUS, OPERATION_STATUS.UNKNOWN);
      aggDto.totalStopMin = stats.stop_minutes;
      aggDto.totalFaultMin = stats.fault_minutes;
      aggDto.totalRunningMin = stats.start_minutes;
      aggDto.operationRate = stats.availablility_rate;
      aggDto.faultRate = stats.fault_rate;
      aggDto.operationDetailList = oprDetailList;
      aggDtoList.push(aggDto);
    }

    return aggDtoList;

  }
};