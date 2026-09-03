import { Logger, Injectable } from '@nestjs/common';
import { CellViewRepository } from './repositories/cell-view.repository';
import { CellViewResponseDto } from './dto/response/cell-view-response.dto';
import { plainToInstance } from 'class-transformer';
import { FilteringCellViewDto } from './dto/request/filtering-cell-view.dto';
import { CellView } from './entities/cell-view.entity';
import { WARNING_ALARM } from 'src/common/enum/alarm.enum';
import { DEBUG_VIEW_TABLE_SEARCH } from 'src/config/debug.config';
import { WarehouseService } from 'src/domains/storage/warehouse/warehouse.service';
import { SystemService } from 'src/domains/setting/system/system.service';
import { InventoryAlarmHistoryService } from 'src/domains/alarm/history/alarm-history/sub-domain/inventory-alarm-history/inventory-alarm-history.service';
import { SseService } from 'src/core/sse/sse.service';
import { CELL_STATUS } from 'src/common/enum/cell.enum';
import { WAREHOUSE_TYPE, EQUIPMENT_TYPE } from 'src/common/enum/equipment.enum';
import { ALERT_TYPE, INVENTORY_ALARM_TYPE, ALARM_HISTORY_TYPE } from 'src/common/enum/alarm.enum';
import { InventoryAlarmHistory } from 'src/domains/alarm/history/alarm-history/sub-domain/inventory-alarm-history/entities/inventory-alarm-history.entity';
import { CreateInventoryAlarmHistoryDto } from 'src/domains/alarm/history/alarm-history/sub-domain/inventory-alarm-history/dto/request/create-inventory-alarm-history.dto';
import { SSE_EVENT_TYPE } from 'src/common/enum/sse.enum';

@Injectable()
export class CellViewService {
  private readonly logger = new Logger(CellViewService.name);
  private static checkingInventoryAlarmMap = new Map<number, WARNING_ALARM>();
  private isRunning = false;
  
  constructor(
    private readonly cellViewRepository: CellViewRepository,
    private readonly warehouseService: WarehouseService,
    private readonly systemService: SystemService,
    private readonly inventoryAlarmHistoryService: InventoryAlarmHistoryService,
    private readonly sseService: SseService,
  ) {
    this.initializeCheckingMap();
  }

  onModuleInit() {
    if (DEBUG_VIEW_TABLE_SEARCH) {
      this.scheduleTask();
    }
  }

  private async initializeCheckingMap() {
    try {
      const warehouses = await this.warehouseService.getAllWarehouse();
      warehouses.forEach(warehouse => {
        if (!CellViewService.checkingInventoryAlarmMap.has(warehouse.id)) {
          CellViewService.checkingInventoryAlarmMap.set(warehouse.id, WARNING_ALARM.DEFAULT);
        }
      });
    } catch (error) {
      this.logger.error('Failed to initialize checkingMap:', error);
    }
  }

  async getCellList(filterDto: FilteringCellViewDto): Promise<CellViewResponseDto[]> {
    const cellViewData = await this.cellViewRepository.getFilteredList({ filter: filterDto });
    const result = plainToInstance(CellViewResponseDto, cellViewData, { excludeExtraneousValues: true });
    return result;
  }

  async getCellEntityList(filterDto: FilteringCellViewDto): Promise<CellView[]> {
    const cellViewData = await this.cellViewRepository.getFilteredList({ filter: filterDto });
    return cellViewData;
  }

  private async scheduleTask() {
    if (this.isRunning) {
      this.logger.warn('Previous CellViewCheckService still running, skipping...');
      return;
    }
    this.isRunning = true;
    
    try {
      await this.checkCellView();
  
    } catch (err) {
      this.logger.error('Error during checking transfer:', err.message);
    } finally {
      this.isRunning = false;
    }
    setTimeout(() => this.scheduleTask(), 1000);
  }


  private async checkCellView() {
    const warehouseList = await this.warehouseService.getAllWarehouse();

    for (const warehouse of warehouseList) {
      const { currentCount, currentRatio, warningRatio, dangerRatio } = await this.getStackedRatio(warehouse.id, warehouse.type);
      await this.checkStackedAlarm(warehouse.id, currentCount, currentRatio, warningRatio, dangerRatio);
    }
  }


  private async getStackedRatio(warehousesId: number, warehouseType: WAREHOUSE_TYPE) {
    let capacity = 0;
    let stackedCount = 0;
    let warningRatio = 0;
    let dangerRatio = 0;
    let currentRatio = 0;
    const system = await this.systemService.getSystem();

    // Gantry
    if (warehouseType === WAREHOUSE_TYPE.GANTRY) {
      // 해당 창고 내 총 GantryCell 개수
      const filterGantryDto = new FilteringCellViewDto();
      filterGantryDto.enable = true;
      filterGantryDto.warehouseId = warehousesId;
      filterGantryDto.warehouseType = WAREHOUSE_TYPE.GANTRY
      const gantryCellList = await this.cellViewRepository.getFilteredList({ filter: filterGantryDto });

      // 해당 창고 내 GantryCell 중 적치된 셀 개수
      const gantryCellItemList = gantryCellList
      .filter(item => item.st_count > 0)
      .filter(item => item.cell_status === CELL_STATUS.IN);

      capacity = gantryCellList.length;
      stackedCount = gantryCellItemList.length;
      warningRatio = system.load_warning_ratio_gantry;
      dangerRatio = system.load_danger_ratio_gantry;

    // Crane
    } else if (warehouseType === WAREHOUSE_TYPE.CRANE) {
      // 해당 창고 내 총 CraneCell 개수
      const filterCraneDto = new FilteringCellViewDto();
      filterCraneDto.enable = true;
      filterCraneDto.warehouseId = warehousesId;
      filterCraneDto.warehouseType = WAREHOUSE_TYPE.CRANE;
      const craneCellList = await this.cellViewRepository.getFilteredList({ filter: filterCraneDto });

      // 해당 창고 내 CraneCell 중 적치된 셀 개수
      const gantryCellItemList = craneCellList
      .filter(item => item.st_count > 0)
      .filter(item => item.cell_status === CELL_STATUS.IN)
      .filter(item => item.pallet);

      capacity = craneCellList.length;
      stackedCount = gantryCellItemList.length;
      warningRatio = system.load_warning_ratio_crane;
      dangerRatio = system.load_danger_ratio_crane;
    }
 
    if (capacity > 0) {
      currentRatio = (stackedCount / capacity) * 100;
    }
    //crane에도 동일하게 있는 구조인데, dto를 만들자
    return {
      currentCount: stackedCount,
      currentRatio,
      warningRatio,
      dangerRatio,
    }
  }


  private async checkStackedAlarm(warehouseId: number, currentCount: number, currentRatio: number, warningRatio: number, dangerRatio: number) {
    const currentState = CellViewService.checkingInventoryAlarmMap.get(warehouseId) ?? WARNING_ALARM.DEFAULT;

    let newState = currentState;
    let alertType: ALERT_TYPE | null = null;

    if (currentRatio < warningRatio) {
      newState = WARNING_ALARM.DEFAULT;
    } else if (currentRatio > dangerRatio) {
      if (currentState === WARNING_ALARM.DEFAULT || currentState === WARNING_ALARM.WARN) {
        newState = WARNING_ALARM.DANGER;
        alertType = ALERT_TYPE.DANGER;
      }
    } else if (currentRatio > warningRatio) {
      if (currentState === WARNING_ALARM.DEFAULT || currentState === WARNING_ALARM.DANGER) {
        newState = WARNING_ALARM.WARN;
        alertType = ALERT_TYPE.WARNING;
      }
    }

    if (newState !== currentState) {
      CellViewService.checkingInventoryAlarmMap.set(warehouseId, newState);
      if (currentState !== WARNING_ALARM.DANGER && alertType) {
        await this.createInventoryAlarm(currentCount, alertType, warehouseId);
        this.sseService.sendEventToAll(SSE_EVENT_TYPE.CELL_ALARM_TRIGGER, { warehouseId, currentRatio, alertType });
      }
    }
  }

  private async createInventoryAlarm(currentCount: number, alertType: ALERT_TYPE, warehouseId: number) : Promise<InventoryAlarmHistory> {
    const warehouse = await this.warehouseService.getWarehouseById(warehouseId);

    const createDto = new CreateInventoryAlarmHistoryDto();
    createDto.message = `Inventory Alarm: ${warehouseId} - ${alertType}`;
    createDto.stored_item_count = currentCount;
    createDto.inventory_alarm_type = INVENTORY_ALARM_TYPE.STORED;
    createDto.alert_type = alertType;
    createDto.type = ALARM_HISTORY_TYPE.INVENTORY;
    createDto.warehouse_name = warehouse.name;
    createDto.warehouse_code = warehouse.code;
    createDto.warehouse_type = warehouse.type as WAREHOUSE_TYPE;

    const inventoryAlarmHistory = await this.inventoryAlarmHistoryService.createInventoryAlarmHistory(createDto);
    return inventoryAlarmHistory;
  }
}