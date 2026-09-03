// import { Logger, Injectable } from '@nestjs/common';

// import { DEBUG_SIMULATOR } from 'src/config/debug.config';
// import { AlarmQueueService } from 'src/collector-interface/queue/alarm-queue/alarm-queue.service';
// import { AlarmService } from 'src/domains/alarm/alarm/alarm.service';
// import { rand, stdTypes } from 'src/utils/dummy.util';
// import { CellQueueService } from 'src/domains/__archived__/cell-queue/cell-queue.service';
// import { CreateCellQueueDto } from 'src/domains/__archived__/cell-queue/dto/create-cell-queue.dto';
// import { FilteringItemLocationHistoryDto } from 'src/domains/storage/item/item-location-history/dto/request/filtering-item-location-history.dto';
// import { EQUIPMENT_TYPE, WAREHOUSE_TYPE } from 'src/common/enum/equipment.enum';
// import { ItemLocationHistoryService } from 'src/domains/storage/item/item-location-history/item-location-history.service';
// import { CreateStoredItemDto } from 'src/domains/storage/item/stored_item/dto/create-stored-item.dto';
// import { StoredItemService } from 'src/domains/storage/item/stored_item/stored-item.service';
// import { ItemLocationHistory } from 'src/domains/storage/item/item-location-history/entities/item-location-history.entity';
// import { StoredItem } from 'src/domains/storage/item/stored_item/entities/stored-item.entity';
// import { EquipmentService } from 'src/domains/equipment/equipment/equipment.service';
// import { FilteringCellViewDto } from 'src/collector-interface/view/cell-view/dto/request/filtering-cell-view.dto';
// import { CellViewService } from 'src/collector-interface/view/cell-view/cell-view.service';

// @Injectable()
// export class SimulatorService {
//     private readonly logger = new Logger(SimulatorService.name)
//     private isRunning = false;

//     constructor(
//     private readonly alarmService: AlarmService,
//     private readonly alarmQueueService : AlarmQueueService,
//     private readonly itemLocationHistoryService: ItemLocationHistoryService,
//     private readonly storedItemService: StoredItemService,
//     private readonly equipmentService: EquipmentService,
//     private readonly cellViewService: CellViewService,
//   ) {}

//   onModuleInit() {
//     if (DEBUG_SIMULATOR) {
//       this.scheduleTask();
//     }
//   }

//   private randomAlarmSec = 300; // 초기값 5분. 1-10분 사이에 랜덤하게 변경됨
//   private randomGantryUpdSec = 10; // 초기값 6분. 1-10분 사이에 랜덤하게 변경됨
//   private randomCraneUpdSec = 10; // 초기값 7분. 1-10분 사이에 랜덤하게 변경됨

//   private RANDOM_SEC_MIN = 6; // 최소 5초~
//   private RANDOM_SEC_MAX = 30; // 최대 10초

//   private RANDOM_ALARM_SEC_MIN = 300;   //알람 최소 10분~
//   private RANDOM_ALARM_SEC_MAX = 360;  //알람 최대 11분

//   private async scheduleTask() {
//     try{
//     if (this.isRunning) {
//       this.logger.warn('Task is already running');
//       return;
//     }
//     this.isRunning = true;

//     this.triggerAlarmQueue();
//     //this.triggerGantryUpdSec();
//     //this.triggerCraneUpdSec();


//     setTimeout(() => this.scheduleTask(), 1000);
//     }
//     finally{
//       this.isRunning = false;
//     }
//   }

  
//   private async triggerAlarmQueue() {
//     try {
//       if (this.randomAlarmSec <= 0) {
//         this.randomAlarmSec = rand(this.RANDOM_ALARM_SEC_MIN, this.RANDOM_ALARM_SEC_MAX); // 1분에서 10분 사이 랜덤
//         const alarmList = await this.alarmService.getAllAlarmEntities();
//         const randomAlarmIdx = rand(0, alarmList.length - 1);
//         const selectedAlarm = alarmList[randomAlarmIdx];
//         const allEquipment = await this.equipmentService.getAllEquipmentEntities();
//         const equipmentList = allEquipment.filter(equipment => equipment.equipment_type.id === selectedAlarm.equipment_type.id);
//         const equipment = equipmentList[rand(0, equipmentList.length - 1)];
//         await this.alarmQueueService.createAlarmQueue(selectedAlarm, equipment, 1);
//       } else{
//         this.randomAlarmSec -= 1;
//       }
//     } catch (error) {
//       this.logger.error('Error in triggerAlarmQueue:', error);
//     }
//   }

//   // private async triggerGantryUpdSec() {
//   //   try {
//   //     if (this.randomGantryUpdSec <= 0) {
//   //       this.randomGantryUpdSec = rand(this.RANDOM_SEC_MIN, this.RANDOM_SEC_MAX); // 1분에서 10분 사이 랜덤
//   //       const insertCellDto = new CreateCellQueueDto();

//   //       const randomStatus = rand(0, 1) === 0 ? true : false; // true: 출고, false: 입고
//   //       // 50% 확률로 출고
//   //       if (randomStatus === true) {
//   //         // Gantry에 남아 있는 Stored Item 찾기
//   //         const filterHistoryDto = new FilteringItemLocationHistoryDto();
//   //         filterHistoryDto.shippingStatus = false;
//   //         filterHistoryDto.locationType = WAREHOUSE_TYPE.GANTRY;

//   //         const stackedHistoryList = await this.itemLocationHistoryService.getItemLocationHistoryEntities(filterHistoryDto);
//   //         if (stackedHistoryList.length === 0) {
//   //           this.logger.warn('No gantry cells available for shipping');
//   //           return;
//   //         }
          
//   //         const randomHistoryIdx = rand(0, stackedHistoryList.length - 1);
//   //         const selectedHistory = stackedHistoryList[randomHistoryIdx];
          
//   //         if (!selectedHistory || !selectedHistory.stored_item) {
//   //           this.logger.warn('Invalid history or stored item');
//   //           return;
//   //         }
          
//   //         const storedItem = selectedHistory.stored_item;
//   //         const gantryCell = await this.cellViewService.getCellEntityById(selectedHistory.cell_id);
          
//   //         if (!gantryCell || !gantryCell.equipment || !gantryCell.equipment.warehouse) {
//   //           this.logger.warn('No gantry cell available for shipping');
//   //           return;
//   //         }

//   //         insertCellDto.warehouse_id = gantryCell.equipment.warehouse.id;
//   //         insertCellDto.sku_id = storedItem.sku_id;
//   //         insertCellDto.location_type = WAREHOUSE_TYPE.GANTRY;
//   //         insertCellDto.bank = gantryCell.loc_x;
//   //         insertCellDto.bay = gantryCell.loc_y;
//   //         insertCellDto.port = gantryCell.loc_z;
//   //         insertCellDto.standard_type = storedItem.standard_type;
//   //         insertCellDto.shipping_status = true;
//   //         insertCellDto.out_date = new Date();
//   //         insertCellDto.luggauge_state = true;
//   //         insertCellDto.create_date = new Date();

//   //       } else {
//   //         // 입고 로직
//   //         const availableStoredItems = await this.findStoredItemsShippedFromCraneButNotInGantry();
//   //         if (availableStoredItems.length === 0) {
//   //           this.logger.warn('No stored items available for gantry receiving');
//   //           return;
//   //         }

//   //         const filterCellViewLuggageFalseDto = new FilteringCellViewDto();
//   //         filterCellViewLuggageFalseDto.equipmentType = EQUIPMENT_TYPE.GTR;
//   //         filterCellViewLuggageFalseDto.luggageFlag = false;
//   //         const falseGantryCellViewList = await this.cellViewService.getCellEntityList(filterCellViewLuggageFalseDto);
          
//   //         if (falseGantryCellViewList.length === 0) {
//   //           this.logger.warn('No gantry cells available for receiving');
//   //           return;
//   //         }

//   //         const randomGantryCellIdx = rand(0, falseGantryCellViewList.length - 1);
//   //         const selectedGantryCell = falseGantryCellViewList[randomGantryCellIdx];
          
//   //         if (!selectedGantryCell || !selectedGantryCell.equipment || !selectedGantryCell.equipment.warehouse) {
//   //           this.logger.warn('Invalid gantry cell selected');
//   //           return;
//   //         }
          
//   //         const randomStoredItemIdx = rand(0, availableStoredItems.length - 1);
//   //         const selectedStoredItem = availableStoredItems[randomStoredItemIdx];
          
//   //         if (!selectedStoredItem) {
//   //           this.logger.warn('Invalid stored item selected');
//   //           return;
//   //         }

//   //         insertCellDto.warehouse_id = selectedGantryCell.equipment.warehouse.id;
//   //         insertCellDto.sku_id = selectedStoredItem.sku_id;
//   //         insertCellDto.location_type = WAREHOUSE_TYPE.GANTRY;
//   //         insertCellDto.bank = selectedGantryCell.loc_x;
//   //         insertCellDto.bay = selectedGantryCell.loc_y;
//   //         insertCellDto.port = selectedGantryCell.loc_z;
//   //         insertCellDto.standard_type = selectedStoredItem.standard_type;
//   //         insertCellDto.shipping_status = false;
//   //         insertCellDto.in_date = new Date();
//   //         insertCellDto.create_date = new Date();
//   //       }
        
//   //       const updSuccess = await this.cellQueueService.createCellQueue(insertCellDto);
//   //       if (updSuccess) {
//   //         this.logger.debug(`[Simulation] Successfully updated gantry cell with warehouse ${insertCellDto.warehouse_id}, bank ${insertCellDto.bank}, bay ${insertCellDto.bay}, port ${insertCellDto.port}, sku id ${insertCellDto.sku_id}, status: ${randomStatus ? 'shipping' : 'receiving'}`);
//   //       } else {
//   //         this.logger.error(`[Simulation] Failed to update gantry cell with warehouse ${insertCellDto.warehouse_id}, bank ${insertCellDto.bank}, bay ${insertCellDto.bay}, port ${insertCellDto.port}, sku id ${insertCellDto.sku_id}, status: ${randomStatus ? 'shipping' : 'receiving'}`);
//   //       }

//   //     } else {
//   //       this.randomGantryUpdSec -= 1; 
//   //     }
//   //   } catch (error) {
//   //     this.logger.error('Error in triggerGantryUpdSec:', error);
//   //     // 더 자세한 오류 정보 로깅
//   //     if (error instanceof Error) {
//   //       this.logger.error('Error details:', error.message);
//   //       this.logger.error('Error stack:', error.stack);
//   //     }
//   //   }
//   // }

//   // private async triggerCraneUpdSec(){
//   //   try {
//   //     if (this.randomCraneUpdSec <= 0) {
//   //       this.randomCraneUpdSec = rand(this.RANDOM_SEC_MIN, this.RANDOM_SEC_MAX); // 1분에서 10분 사이 랜덤
//   //       const insertCellDto = new CreateCellQueueDto();

//   //       const randomStatus = rand(0, 1) === 0 ? true : false; // true: 출고, false: 입고
//   //       // 50% 확률로 출고
//   //       if (randomStatus === true) {
//   //         const filterHistoryDto = new FilteringItemLocationHistoryDto();
//   //         filterHistoryDto.shippingStatus = false;
//   //         filterHistoryDto.locationType = WAREHOUSE_TYPE.CRANE;
//   //         // 현재 CRANE에서 출고가 안 되고 적치되어 있는 Item 내역들 조회
//   //         const stackedPalletHistory = await this.itemLocationHistoryService.getItemLocationHistoryEntities(filterHistoryDto);

//   //         // 적치된 것이 없다면 출고가 불가능하므로 출고 로직 종료
//   //         if (stackedPalletHistory.length === 0) {
//   //           this.logger.warn('No Crane cells available for shipping');
//   //           return;
//   //         }

//   //         const randomPalletIdx = rand(0, stackedPalletHistory.length - 1);
//   //         const selectedHistory = stackedPalletHistory[randomPalletIdx];  // 출고시킬 Pallet 중 임의로 하나 선택
//   //         const storedItem = selectedHistory.stored_item;  // 출고시킬 Pallet에 있던 Stored Item

//   //         const craneCell = await this.cellViewService.getCellEntityById(selectedHistory.cell_id);
//   //         if (!craneCell || !craneCell.equipment || !craneCell.equipment.warehouse) {
//   //           this.logger.warn('No crane cell available for shipping');
//   //           return;
//   //         }

//   //         insertCellDto.warehouse_id = craneCell.equipment.warehouse.id;  // 출고시킬 Pallet의 창고 ID
//   //         insertCellDto.sku_id = storedItem.sku_id;  // 출고시킬 Stored Item의 SKU ID
//   //         insertCellDto.pallet_id = craneCell.pallet?.id || null;  // null 체크 추가
//   //         insertCellDto.location_type = WAREHOUSE_TYPE.CRANE;  // 출고 위치 타입 (Crane)
//   //         insertCellDto.bank = craneCell.loc_x;  // 출고시킬 Pallet의 Bank
//   //         insertCellDto.bay = craneCell.loc_y;  // 출고시킬 Pallet의 Bay
//   //         insertCellDto.level = craneCell.loc_z;  // 출고시킬 Pallet의 Level
//   //         insertCellDto.standard_type = storedItem.standard_type;  // 출고시킬 Stored Item의 타이어 규격
//   //         insertCellDto.shipping_status = true;  // 출고
//   //         insertCellDto.out_date = new Date();  // 출고 날짜
//   //         insertCellDto.luggauge_state = true;  // 화물 유무 상태
//   //         insertCellDto.create_date = new Date();  // 생성 날짜

//   //       // 50% 확률로 입고
//   //       } else {
//   //         const filterCellViewDto = new FilteringCellViewDto();
//   //         filterCellViewDto.equipmentType = EQUIPMENT_TYPE.STC;
          
//   //         // 비어있는 Crane Cell들을 가져옴 (pallet_id가 null이거나 luggage_flag가 false인 것들)
//   //         const emptyCraneCellFilter = new FilteringCellViewDto();
//   //         emptyCraneCellFilter.equipmentType = EQUIPMENT_TYPE.STC;
//   //         emptyCraneCellFilter.luggageFlag = false; // 화물이 없는 cell들
          
//   //         const emptyCraneCellList = await this.cellViewService.getCellEntityList(emptyCraneCellFilter);
          
//   //         if (emptyCraneCellList.length === 0) {
//   //           this.logger.warn('No empty crane cells available');
//   //           return;
//   //         }

//   //         // 타임스탬프 기반 고유 sku_id 생성 함수
//   //         const generateUniqueSkuId = (): string => {
//   //           const timestamp = Date.now();
//   //           const randomNum = rand(0, 9999);
//   //           return `item_sku_${timestamp}_${randomNum.toString().padStart(4, '0')}`;
//   //         };

//   //         // 자동 창고에 맨 처음으로 입고 -> Stored Item 생성
//   //         const createStoredItemDto = new CreateStoredItemDto();
//   //         const stdTypesLength = stdTypes.length;
//   //         if (stdTypesLength === 0) {
//   //           this.logger.warn('No standard types available');
//   //           return;
//   //         }
//   //         createStoredItemDto.standard_type = stdTypes[rand(0, stdTypesLength - 1)];
//   //         createStoredItemDto.sku_id = generateUniqueSkuId();
//   //         const storedItem = await this.storedItemService.createStoredItem(createStoredItemDto);

//   //         // 비어있는 Crane Cell 중 하나를 랜덤하게 선택
//   //         const randomCraneCellIdx = rand(0, emptyCraneCellList.length - 1);
//   //         const selectedCraneCell = emptyCraneCellList[randomCraneCellIdx];
          
//   //         if (!selectedCraneCell || !selectedCraneCell.equipment || !selectedCraneCell.equipment.warehouse) {
//   //           this.logger.warn('Invalid crane cell selected');
//   //           return;
//   //         }

//   //         insertCellDto.warehouse_id = selectedCraneCell.equipment.warehouse.id;
//   //         insertCellDto.sku_id = storedItem.sku_id;
//   //         insertCellDto.location_type = WAREHOUSE_TYPE.CRANE;
//   //         insertCellDto.pallet_id = selectedCraneCell.pallet?.id || null;  // null 체크 추가
//   //         insertCellDto.bank = selectedCraneCell.loc_x;
//   //         insertCellDto.bay = selectedCraneCell.loc_y;
//   //         insertCellDto.level = selectedCraneCell.loc_z;
//   //         insertCellDto.standard_type = storedItem.standard_type;
//   //         insertCellDto.shipping_status = false;
//   //         insertCellDto.in_date = new Date();
//   //         insertCellDto.luggauge_state = true;
//   //         insertCellDto.create_date = new Date();
//   //       }
        
//   //       const updSuccess = await this.cellQueueService.createCellQueue(insertCellDto);
//   //       if (updSuccess) {
//   //         this.logger.debug(`[Simulation] Successfully updated pallet cell with warehouse ${insertCellDto.warehouse_id}, bank ${insertCellDto.bank}, bay ${insertCellDto.bay}, level ${insertCellDto.level}, sku id ${insertCellDto.sku_id}, status: ${randomStatus ? 'shipping' : 'receiving'}`);
//   //       } else {
//   //         this.logger.error(`[Simulation] Failed to update pallet cell with warehouse ${insertCellDto.warehouse_id}, bank ${insertCellDto.bank}, bay ${insertCellDto.bay}, level ${insertCellDto.level}, sku id ${insertCellDto.sku_id}, status: ${randomStatus ? 'shipping' : 'receiving'}`);
//   //       }

//   //     } else {
//   //       this.randomCraneUpdSec -= 1; 
//   //     }
//   //   } catch (error) {
//   //     this.logger.error('Error in triggerCraneUpdSec:', error);
//   //     // 더 자세한 오류 정보 로깅
//   //     if (error instanceof Error) {
//   //       this.logger.error('Error details:', error.message);
//   //       this.logger.error('Error stack:', error.stack);
//   //     }
//   //   }
//   // }

  
//   // // CRANE에서 출고된 후 아직 GANTRY에 입고되지 않은 Stored Item들을 찾는 메서드
//   // private async findStoredItemsShippedFromCraneButNotInGantry(): Promise<StoredItem[]> {
//   //   // 모든 ItemLocationHistory 데이터 조회
//   //   const allHistoryList = await this.itemLocationHistoryService.getItemLocationHistoryEntities();
    
//   //   // stored item ID별로 그룹화
//   //   const itemGroup = new Map<number, ItemLocationHistory[]>();
    
//   //   allHistoryList.forEach(item => {
//   //     const storedItemId = item.stored_item.id;
//   //     if (!itemGroup.has(storedItemId)) {
//   //       itemGroup.set(storedItemId, []);
//   //     }
//   //     itemGroup.get(storedItemId)!.push(item);
//   //   });

//   //   const availableStoredItems: StoredItem[] = [];
    
//   //   itemGroup.forEach((histories, storedItemId) => {
//   //     // ID 기준으로 내림차순 정렬하여 최신 레코드부터 확인
//   //     const sortedHistories = histories.sort((a, b) => b.id - a.id);
      
//   //     // 최신 레코드가 CRANE에서 출고된 경우인지 확인
//   //     const latestHistory = sortedHistories[0];
//   //     if (latestHistory.location_type === WAREHOUSE_TYPE.CRANE && latestHistory.out_date !== null) {
//   //       // CRANE 출고 이후에 GANTRY 입고 이력이 있는지 확인
//   //       const craneOutDate = latestHistory.out_date;
//   //       const hasGantryInAfterCraneOut = sortedHistories.some(history => 
//   //         history.location_type === WAREHOUSE_TYPE.GANTRY && 
//   //         history.in_date > craneOutDate
//   //       );
        
//   //       // CRANE 출고 이후 GANTRY 입고 이력이 없는 경우만 추가
//   //       if (!hasGantryInAfterCraneOut) {
//   //         availableStoredItems.push(latestHistory.stored_item);
//   //       }
//   //     }
//   //   });
    
//   //   return availableStoredItems;
//   // }
// };