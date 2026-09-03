import { Logger, Injectable } from '@nestjs/common';
import { CellViewRepository } from './repositories/cell-view.repository';
import { FilteringCellViewDto } from './dto/request/filtering-cell-view.dto';
import { CraneCellCurrentStackedCountsDto } from './dto/response/crane-cell-current-stacked-counts.dto';
import { EQUIPMENT_TYPE, WAREHOUSE_TYPE } from 'src/common/enum/equipment.enum';
import { CellStackedCountsDto } from './dto/response/cell-stacked-counts.dto';
import { CellView } from './entities/cell-view.entity';
import { CraneCellViewStatsRepository } from './repositories/crane-cell-view.stats.repository';
import { plainToInstance } from 'class-transformer';
import { PalletService } from 'src/domains/storage/pallet/pallet.service';
import { PalletGroupsResponseDto } from './dto/response/pallet-groups-response.dto';
import { LongProductResponseDto } from './dto/response/long-product-response.dto';
import { SystemService } from 'src/domains/setting/system/system.service';
import { DEBUG_LONG_TERM_INVENTORY_ALARM } from 'src/config/debug.config';
import { FilteringAlarmHistoryDto } from 'src/domains/alarm/history/alarm-history/dto/request/filtering-alarm-history.dto';
import { FilteringInventoryAlarmHistoryDto } from 'src/domains/alarm/history/alarm-history/sub-domain/inventory-alarm-history/dto/request/filtering-inventory-alarm-history.dto';
import { ALERT_TYPE, INVENTORY_ALARM_TYPE, ALARM_HISTORY_TYPE } from 'src/common/enum/alarm.enum';
import { AlarmHistoryService } from 'src/domains/alarm/history/alarm-history/alarm-history.service';
import { CreateInventoryAlarmHistoryDto } from 'src/domains/alarm/history/alarm-history/sub-domain/inventory-alarm-history/dto/request/create-inventory-alarm-history.dto';
import { InventoryAlarmHistoryService } from 'src/domains/alarm/history/alarm-history/sub-domain/inventory-alarm-history/inventory-alarm-history.service';
import { SseService } from 'src/core/sse/sse.service';
import { CELL_STATUS } from 'src/common/enum/cell.enum';
import { ORDER } from 'src/common/enum/db.enum';
import { PalletAlarmHistoryService } from 'src/domains/alarm/history/alarm-history/sub-domain/pallet-alarm-history/pallet-alarm-history.service';
import { CreatePalletAlarmHistoryDto } from 'src/domains/alarm/history/alarm-history/sub-domain/pallet-alarm-history/dto/request/create-pallet-alarm-history.dto';
import { UsersService } from 'src/domains/users/users/users.service';
import { AlarmMessageDispatchService } from 'src/domains/alarm/alarm-message-dispatch/alarm-message-dispatch.service';
import { parsePgTextArray, toNum } from 'src/utils/database.util';
import { SSE_EVENT_TYPE } from 'src/common/enum/sse.enum';

@Injectable()
export class CraneCellViewService {
  private readonly logger = new Logger(CraneCellViewService.name);
  private checkingPalletAlarmWarningRatio = 0;
  private isRunning = false;
  private longTermInventoryAlarmFlag = false;
  private lastAlarmDate: string = '';

  constructor(
    private readonly cellViewRepository: CellViewRepository,
    private readonly craneCellViewStatsRepository: CraneCellViewStatsRepository,
    private readonly palletService: PalletService,
    private readonly systemService: SystemService,
    private readonly alarmHistoryService: AlarmHistoryService,
    private readonly inventoryAlarmHistoryService: InventoryAlarmHistoryService,
    private readonly sseService: SseService,
    private readonly palletAlarmHistoryService: PalletAlarmHistoryService,
  ) {
    this.initializeCheckingMap();
  }

  onModuleInit() {
    if (DEBUG_LONG_TERM_INVENTORY_ALARM) {
      // this.scheduleNextRun();
      this.scheduleTask();
    }
  }

  private async initializeCheckingMap() {
    try {
      this.checkingPalletAlarmWarningRatio = 0;
    } catch (error) {
      this.logger.error('Failed to initialize checkingMap:', error);
    }
  }


  // 현재 Crane Cell 전체 실시간 적재량 집계
  async getCurrentStackedCounts(): Promise<CraneCellCurrentStackedCountsDto> {
    const filterDto = new FilteringCellViewDto();
    filterDto.warehouseType = WAREHOUSE_TYPE.CRANE;
    filterDto.enable = true;
    const allCraneCell = await this.cellViewRepository.getFilteredCount({ filter: filterDto });
    
    filterDto.luggageFlag = true;
    const stackedCraneCell = await this.cellViewRepository.getFilteredCount({ filter: filterDto });
    //const stackedCraneCell = allCraneCell.filter(c => c.luggage_flag === true);

    const totalCount = allCraneCell;
    const currentCount = stackedCraneCell;
    const emptyCellCount = totalCount - currentCount;
    const rate = Number(((currentCount / totalCount) * 100).toFixed(2));

    const result = {
      currentCount,
      totalCount,
      rate,
      emptyCellCount,
    };

    return result;
  }


  // warehouseId별 그룹화 및 적치 가능/적치/미적치/금지/체크/적치율 현황 개수 집계
  async getCurrentCraneCountsByWarehouse(): Promise<CellStackedCountsDto[]> {
    const rows = await this.craneCellViewStatsRepository.getCurrentCraneCountsByWarehouse();

    const result =  rows.map((row) => {
      const types = parsePgTextArray(row.standard_type_list);
      return {
        warehouseId: Number(row.warehouse_id),
        stackAreaCode: this.convertLocUnitToEquipmentCode(row.loc_unit),
        currentCount: toNum(row.current), 
        totalCount: toNum(row.enabled),
        disabledCount: toNum(row.disabled),
        emptyCellCount: toNum(row.unassigned),
        standardTypes: types,
        standardTypeCount: types.length,
        checkCount: 0,
      };
    });

    return result as CellStackedCountsDto[];
  }

  private convertLocUnitToEquipmentCode(locUnit : string) : string{
    let equipCode = 'UNKNOWN'
    switch (locUnit){
      case '0001':
        equipCode = 'SC1'
        break;
      case '0002':
        equipCode = 'SC2'
        break;
      case '0003':
        equipCode = 'SC3'
        break;
      case '0004':
        equipCode = 'SC4'
        break;
      case '0005':
        equipCode = 'SC5'
        break;
      case '0006':
        equipCode = 'SC6'
        break;
      case '0007':
        equipCode = 'SC7'
        break;
      case '0008':
        equipCode = 'SC8'
        break;
      case '0009':
        equipCode = 'SC9'
        break;
      case '0010':
        equipCode = 'SC10'
        break;
    }
    return equipCode;
  }

  // Pallet level별 그룹화 및 개수 집계
  async getPalletLevelGroups(): Promise<PalletGroupsResponseDto[]> {
    
    // Pallet ID 별 몇 개의 품목이 쌓여 있는지 확인하는 맵
    const palletLevelCounts: {
      [palletId: number]: number;
    } = {};

    const filterCellViewDto = new FilteringCellViewDto();
    filterCellViewDto.warehouseType = WAREHOUSE_TYPE.CRANE;
    filterCellViewDto.enable = true;
    const enabledCraneCells = await this.cellViewRepository.getFilteredList({ filter: filterCellViewDto });
    const craneCellWithPallet = enabledCraneCells.filter(item => item.pallet);
    
    for (const item of craneCellWithPallet) {
      const palletId = item.pallet!.id;
      if (!palletLevelCounts[palletId]) {
        palletLevelCounts[palletId] = 0;
      }
      palletLevelCounts[palletId] += item.st_count;
    }

    // level 구간 분류 함수
    const levelGrouped = {
      '<=2': { recordCount: 0, productCount: 0 },
      '3AND5': { recordCount: 0, productCount: 0 },
      '6AND10': { recordCount: 0, productCount: 0 },
      '11AND15': { recordCount: 0, productCount: 0 },
      '>15': { recordCount: 0, productCount: 0 },
    };

    Object.values(palletLevelCounts).forEach(itemCount => {
      if (itemCount <= 2) {
        levelGrouped['<=2'].recordCount += 1;
        levelGrouped['<=2'].productCount += itemCount;
      } else if (itemCount <= 5) {
        levelGrouped['3AND5'].recordCount += 1;
        levelGrouped['3AND5'].productCount += itemCount;
      } else if (itemCount <= 10) {
        levelGrouped['6AND10'].recordCount += 1;
        levelGrouped['6AND10'].productCount += itemCount;
      } else if (itemCount <= 15) {
        levelGrouped['11AND15'].recordCount += 1;
        levelGrouped['11AND15'].productCount += itemCount;
      } else {
        levelGrouped['>15'].recordCount += 1;
        levelGrouped['>15'].productCount += itemCount;
      }
    });

    // 정렬 순서 정의
    const levelOrder = ['<=2', '3AND5', '6AND10', '11AND15', '>15'];
    
    // 결과 변환 및 정렬
    const transformedData = levelOrder.map(name => {
      const data = levelGrouped[name];
      return {
        name,
        recordCount: data.recordCount,
        productCount: data.productCount,
        average: data.recordCount > 0 ? Number((data.productCount / data.recordCount).toFixed(2)) : Number('0.00'),  // level별 현재 적치된 데이터 개수 / 레코드 개수
      };
    });

    // 총계 계산
    const recordTotalCount = transformedData.reduce((sum, item) => sum + item.recordCount, 0);
    const productTotalCount = transformedData.reduce((sum, item) => sum + item.productCount, 0);

    transformedData.push({
      name: 'Total',
      recordCount: recordTotalCount,
      productCount: productTotalCount,
      average: recordTotalCount > 0 ? Number((productTotalCount / recordTotalCount).toFixed(2)) : Number('0.00'),
    });

    return transformedData;
  }


  // 장기 재고 현황 조회
  async getLongProductGroups() {
    const filterCellViewDto = new FilteringCellViewDto();
    filterCellViewDto.warehouseType = WAREHOUSE_TYPE.CRANE
    // filterCellViewDto.luggageFlag = true;
    const totalCraneCells = await this.cellViewRepository.getFilteredList({ filter: filterCellViewDto });
    const stackedCraneCells = totalCraneCells.filter(item => item.pallet != null);  // 적재 유무를 pallet 여부로 봄 (luggageFlag는 정확하지 않음)

    // 날짜 구간 구분 함수
    const getDateCategory = (date: Date): string => {
      const now = new Date();
      const monthsAgo3 = new Date(now);
      monthsAgo3.setMonth(now.getMonth() - 3);
      const monthsAgo6 = new Date(now);
      monthsAgo6.setMonth(now.getMonth() - 6);
      const yearAgo = new Date(now);
      yearAgo.setFullYear(now.getFullYear() - 1);

      if (date >= monthsAgo3) return '3MONTH_BELOW';
      if (date >= monthsAgo6) return '6MONTH_BELOW';
      if (date >= yearAgo) return '1YEAR_BELOW';
      return '1YEAR_ABOVE';
    };

    const grouped = new Map<string, number>();
    stackedCraneCells.forEach(item => {
      const key = `${getDateCategory(item.in_date)}-${item.standard_type}`;
      grouped.set(key, (grouped.get(key) || 0) + 1);
    });

    // 결과 변환
    const dateGroups = new Map<string, any[]>();
    grouped.forEach((recordCount, dateAndType) => {
      const [dateCategory, standardType] = dateAndType.split('-');
      if (!dateGroups.has(dateCategory)) {
        dateGroups.set(dateCategory, []);
      }
      dateGroups.get(dateCategory)!.push({ standardType, totalCount: recordCount });
    });

    const result = Array.from(dateGroups.entries()).map(([name, items]) => {
      const totalCount = items.reduce((sum, item) => sum + item.totalCount, 0);
      return {
        name,  // 날짜 그룹
        totalCount,  // 모든 타이어 개수 누적합
        items: items
        .sort((a, b) => {
          if (b.totalCount !== a.totalCount) {
            return b.totalCount - a.totalCount;
          }
          return a.standardType.localeCompare(b.standardType);
        })
          .map(item => ({
            ...item,  // 품목별 장기 재고 현황 (개수)
            typeRate: Math.round((item.totalCount / totalCount) * 100),
        })),
        nameRate: 0, // 전체 개수에서 각 날짜 그룹의 비율 (아래에서 계산)
      };
    });

    const dateOrder = ['3MONTH_BELOW', '6MONTH_BELOW', '1YEAR_BELOW', '1YEAR_ABOVE'];
    result.sort((a, b) => {
      const aIndex = dateOrder.indexOf(a.name);
      const bIndex = dateOrder.indexOf(b.name);
      return aIndex - bIndex;
    });

    // 전체 비율 계산
    const grandTotal = result.reduce((sum, group) => sum + group.totalCount, 0);
    result.forEach(group => {
      group.nameRate = grandTotal > 0 ? Math.round((group.totalCount / grandTotal) * 100) : 0;
    });

    const itemResult = plainToInstance(LongProductResponseDto, result, { excludeExtraneousValues: true });
    return { totalCount: grandTotal, items: itemResult };
  }

  async getCraneStackedRatio(warehouseId: number) {
    // 해당 창고에 들어있는 Pallet 총 개수
    const filterDto = new FilteringCellViewDto();
    filterDto.warehouseId = warehouseId;
    filterDto.warehouseType = WAREHOUSE_TYPE.CRANE
    filterDto.enable = true;
    const craneCellList = await this.cellViewRepository.getFilteredList({filter: filterDto});
    const totalPallet = craneCellList.filter(item => item.pallet)
    const capacity = totalPallet.length;

    // 해당 창고에 들어있는 Pallet 중 적치된 Pallet 개수
    const usedPalletList = craneCellList.filter(item => item.st_count > 0);

    const system = await this.systemService.getSystem();
    const warningRatio = system.load_warning_ratio_crane;
    const dangerRatio = system.load_danger_ratio_crane;
    const stackedCount = usedPalletList.length;
    const currentRatio = (stackedCount / capacity) * 100;

    const result = {
      currentCount: stackedCount,
      currentRatio: Number(currentRatio.toFixed(2)),
      warningRatio,
      dangerRatio,
    }
    return result;
  }


  // private scheduleNextRun() {
  //   const now = new Date();
  //   const next8am = new Date(now);
  //   next8am.setDate(now.getHours() >= 8 ? now.getDate() + 1 : now.getDate());
  //   next8am.setHours(8, 0, 0, 0);

  //   const delayMs = next8am.getTime() - now.getTime();
  //   this.logger.log(`Inventory task scheduled for ${next8am.toLocaleString()} (in ${(delayMs / 1000 / 60).toFixed(1)} minutes)`);

  //   setTimeout(() => {
  //     this.scheduleTask()
  //       .then(() => this.scheduleNextRun())
  //       .catch((err) => {
  //         this.logger.error('Scheduled task failed:', err.message);
  //         this.scheduleNextRun();
  //       });
  //   }, delayMs);
  // }


  private async scheduleTask() {
    if (this.isRunning) {
      this.logger.warn('Previous AlarmCheckService still running, skipping...');
      return;
    }
    this.isRunning = true;
    
    try {
      await this.longTermInventoryAlarm();
      await this.palletAlarm();
  
    } catch (err) {
      this.logger.error('Error during Alarm transfer:', err.message);
    } finally {
      this.isRunning = false;
    }
    setTimeout(() => this.scheduleTask(), 1000);
  }


  private async longTermInventoryAlarm() {
    const now = new Date();
    const currentDate = now.toDateString();
    const targetTime = new Date().setHours(8, 0, 0, 0);

    if (now >= new Date(targetTime)) {
      if (this.lastAlarmDate !== currentDate) {
        this.longTermInventoryAlarmFlag = true;
        this.lastAlarmDate = currentDate;
      }
    }
    if (!this.longTermInventoryAlarmFlag) {
      return;
    }
    const system = await this.systemService.getSystem();
    const remainingDay = system.inventory_alarm_remaining_day;
    const cutoffDate = new Date(new Date().setDate(new Date().getDate() - remainingDay));

    const filterDto = new FilteringCellViewDto();
    filterDto.enable = true;
    filterDto.InEndDate = cutoffDate;
    filterDto.luggageFlag = true;
    const craneCellList = await this.cellViewRepository.getFilteredList({ filter: filterDto });

    // standardType + warehouse별 그룹화
    const warehouseTypeGroups = new Map<string, {
      standardType: string;
      warehouseId: number;
      warehouseName: string;
      warehouseCode: string;
      warehouseType: WAREHOUSE_TYPE;
      items: CellView[];
    }>();

    for (const item of craneCellList) {
      const warehouse = item.warehouse;
      const standardType = item.standard_type;
      const key = `${standardType}_${warehouse.id}`;

      if (!warehouseTypeGroups.has(key)) {
        warehouseTypeGroups.set(key, {
          standardType,
          warehouseId: warehouse.id,
          warehouseName: warehouse.name,
          warehouseCode: warehouse.code,
          warehouseType: warehouse.type as WAREHOUSE_TYPE,
          items: []
        });
      }

      warehouseTypeGroups.get(key)!.items.push(item);
    }

    // 각 그룹별로 알람 처리
    for (const [key, group] of warehouseTypeGroups) {
      const { standardType, warehouseId, warehouseCode, warehouseName, warehouseType, items } = group;

      // 최근 알람 조회
      const baseFilterDto = new FilteringAlarmHistoryDto();
      const filterAlarmDto = new FilteringInventoryAlarmHistoryDto();
      filterAlarmDto.standardType = standardType;
      filterAlarmDto.inventoryAlarmType = INVENTORY_ALARM_TYPE.LONG_TERM;
      filterAlarmDto.warehouseCode = warehouseCode;
      baseFilterDto.filteringInventoryAlarmHistory = filterAlarmDto;
      baseFilterDto.alarmTypeList = [ALARM_HISTORY_TYPE.INVENTORY];
      
      const recentAlarms = await this.alarmHistoryService.getFilteredLimitEntities(1, baseFilterDto, ORDER.DESC);
      
      // 최근 알람 이후의 아이템들만 필터링
      let filteredItems = items;
      if (recentAlarms.length > 0) {
        const lastAlarmDate = recentAlarms[0].create_date;
        filteredItems = items.filter(item => item.in_date > lastAlarmDate);
      }

      if (filteredItems.length > 0) {
        const createInventoryAlarmDto = new CreateInventoryAlarmHistoryDto();
        createInventoryAlarmDto.message = `Long Term Inventory: ${standardType} (Warehouse ${warehouseId}) - ${filteredItems.length} items`;

        createInventoryAlarmDto.standard_type = standardType;
        createInventoryAlarmDto.stored_item_count = filteredItems.reduce((sum, item) => sum + item.st_count, 0);
        createInventoryAlarmDto.inventory_alarm_type = INVENTORY_ALARM_TYPE.LONG_TERM;
        createInventoryAlarmDto.alert_type = ALERT_TYPE.WARNING;
        createInventoryAlarmDto.type = ALARM_HISTORY_TYPE.INVENTORY;
        createInventoryAlarmDto.warehouse_name = warehouseName;
        createInventoryAlarmDto.warehouse_code = warehouseCode;
        createInventoryAlarmDto.warehouse_type = warehouseType;

        const inventoryAlarmHistory = await this.inventoryAlarmHistoryService.createInventoryAlarmHistory(createInventoryAlarmDto);

        if (system.inventory_alarm_enabled) {
          this.sseService.sendEventToAll(SSE_EVENT_TYPE.INVENTORY_ALARM_TRIGGER, {
            ...inventoryAlarmHistory,
            warehouseId,
            standardType
          });
        }
      }
    }
    this.longTermInventoryAlarmFlag = false;
  }


  private async palletAlarm() {
    const palletLevelCounts: { [palletId: number]: number } = {};
    const allPallets = await this.palletService.getPalletEntityList();

    const filterDto = new FilteringCellViewDto();
    filterDto.warehouseType = WAREHOUSE_TYPE.CRANE
    filterDto.enable = true;
    filterDto.cellStatus = CELL_STATUS.IN;
    const craneCellList = await this.cellViewRepository.getFilteredList({ filter: filterDto });
    const craneCellWithPallet = craneCellList.filter(item => item.pallet);
    
    for (const item of craneCellWithPallet) {
      const palletId = item.pallet!.id;
      palletLevelCounts[palletId] = item.st_count;
    }

    const palletCountBelowTwo = Object.values(palletLevelCounts).filter(item => item <= 2).length;
    const rateOfBelowTwo = (palletCountBelowTwo / allPallets.length) * 100;
    if (rateOfBelowTwo >= 15 && this.checkingPalletAlarmWarningRatio < 15) {
      this.checkingPalletAlarmWarningRatio = rateOfBelowTwo;
      // 알람 내역에 추가
      const createDto = new CreatePalletAlarmHistoryDto();
      createDto.warning_count = palletCountBelowTwo;
      createDto.message = 'Low inventory alert: Over 15% of pallets have 2 or fewer items';
      createDto.type = ALARM_HISTORY_TYPE.PALLET;
      const newAlarmHistory = await this.palletAlarmHistoryService.createPalletAlarmHistory(createDto);

      // SMS 전송
      // const users = await this.usersService.findAllUserEntities();
      // for (const user of users) {
      //   if (user.phone_number) {
      //     const msgDispatchDto = new CreateAlarmSmsDto();
      //     msgDispatchDto.alarm_history_id = newAlarmHistory.alarm_history.id;
      //     msgDispatchDto.message = createDto.message;
      //     msgDispatchDto.phone_number = user.phone_number;
      //     msgDispatchDto.users_seq_id = user.seq_id;

      //     await this.messageDispatchService.createAlarmSms(msgDispatchDto);
      //   }
      // }
    }
    
    this.checkingPalletAlarmWarningRatio = rateOfBelowTwo 
  }
}