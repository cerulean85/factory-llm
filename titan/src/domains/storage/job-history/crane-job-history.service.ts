import { Logger, Injectable } from '@nestjs/common';
import { JobHistoryRepository } from './repositories/job-history.repository';
import { FilteringJobHistoryDto } from './dto/request/filtering-job-history.dto';
import { EQUIPMENT_TYPE, TASK_TYPE, WAREHOUSE_TYPE } from 'src/common/enum/equipment.enum';
import { FilteringDateDto } from 'src/common/dto/filtering-date.dto';
import { DateDaySplit } from 'src/utils/date-transform.util';
import { DailyStatusCountsDto } from './dto/response/daily-status-counts.dto';
import { JobHistoryService } from './job-history.service';
import { plainToInstance } from 'class-transformer';
import { MonthlyStatusCountsDto } from './dto/response/monthly-status-counts.dto';
import { JobHistory } from './entities/job-history.entity';
import { StandardTypesDailyCountsDto } from './dto/response/standard-types-daily-counts.dto';

enum PROCESS_TYPE {
  IN = 'IN',
  OUT = 'OUT',
}

@Injectable()
export class CraneJobHistoryService {
  private readonly logger = new Logger(CraneJobHistoryService.name)

  constructor(
    private readonly jobHistoryRepository: JobHistoryRepository,
    private readonly jobHistoryService: JobHistoryService,
  ) {}


  // 일별 적치량 & 출고량 (+누적량) 조회
  async getDailyCraneCounts(filterDto: FilteringJobHistoryDto): Promise<DailyStatusCountsDto[]> {
    // 1. Repository에서 필터링된 모든 데이터 가져오기
    const allData = await this.jobHistoryRepository.getFilteredList({ filter: filterDto });
    const workingComplete = this.jobHistoryService.getStackedCompleteEntities(allData);

    // 2. 날짜별로 그룹화 및 개수 집계
    const groupByDate = new Map<string, number>();
    
    for (const item of workingComplete) {
      const dateKey = await DateDaySplit(item.job_date); // YYYY-MM-DD 형식
      if (groupByDate.has(dateKey)) {
        // 조회된 날짜가 이미 존재
        let prevCnt = groupByDate.get(dateKey) ?? 0;
        groupByDate.set(dateKey, prevCnt + 1);
      } else {
        // 조회된 날짜가 이전에 없을 시
        groupByDate.set(dateKey, 1);
      }
    };

    // 3. 현재 및 누적 적치량 집계
    let currentDate = filterDto.jobStartDate ? new Date(filterDto.jobStartDate) : new Date();
    let endDate = filterDto.jobEndDate ? new Date(filterDto.jobEndDate) : new Date();

    let result: {date: string, currentCount: number, cumulativeCount: number}[] = [];
    let cumulativeCount = 0;
    while (currentDate <= endDate) {
      const dateStr = await DateDaySplit(currentDate);
      const currentCount = groupByDate.get(dateStr) || 0; // groupByDate Map에서 날짜에 따른 개수 조회
      cumulativeCount += currentCount;
      result.push({
        date: dateStr,
        currentCount,
        cumulativeCount,
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }
    // 결과 반환
    return result;
  }


  // 월별 입고량 및 출고량 조회
  async getMonthlyCraneCounts(filteringDateDto: FilteringDateDto): Promise<MonthlyStatusCountsDto[]> {
    // 필터 객체 생성 함수
    const createFilter = (dateField: PROCESS_TYPE) => {
      const filter = new FilteringJobHistoryDto();
      filter.jobStartDate =  filteringDateDto.startDate;
      filter.jobEndDate = filteringDateDto.endDate; 
      filter.warehouseType = WAREHOUSE_TYPE.CRANE;
      
      if (dateField === PROCESS_TYPE.IN) {
        filter.taskType = TASK_TYPE.INPUT;
      } else {
        filter.taskType = TASK_TYPE.OUTPUT;
      }
      return filter;
    };

    // Repository에서 필터링된 데이터 가져오기
    const [filteredInData, filteredOutData] = await Promise.all([
      this.jobHistoryRepository.getFilteredList({ filter: createFilter(PROCESS_TYPE.IN) }),
      this.jobHistoryRepository.getFilteredList({ filter: createFilter(PROCESS_TYPE.OUT) }),
    ]);
    const inCompleteData = this.jobHistoryService.getStackedCompleteEntities(filteredInData);
    const outCompleteData = this.jobHistoryService.getStackedCompleteEntities(filteredOutData);

    // 창고 ID별로 그룹화 및 개수 집계
    const groupByWarehouse = new Map<number, {
      inPallet: Set<number>;
      outPallet: Set<number>;
      inTire: number;
      outTire: number;
    }>();
  
    const groupDataByWarehouse = (completeData: JobHistory[], isIn: boolean) => {
      for (const data of completeData) {
        const warehouseId = data.warehouse.id;
        if (!warehouseId) continue;
  
        if (!groupByWarehouse.has(warehouseId)) {
          groupByWarehouse.set(warehouseId, {
            inPallet: new Set<number>(),
            outPallet: new Set<number>(),
            inTire: 0,
            outTire: 0,
          });
        }

        if (data.st_count > 0) {
          const warehouseData = groupByWarehouse.get(warehouseId)!;
          if (isIn) {
            warehouseData.inPallet.add(data.pallet!.id);
            warehouseData.inTire += data.st_count;
          } else {
            warehouseData.outPallet.add(data.pallet!.id);
            warehouseData.outTire += data.st_count;
          }
        }
      }  
    }

    groupDataByWarehouse(inCompleteData, true); 
    groupDataByWarehouse(outCompleteData, false);

    const rawData = Array.from(groupByWarehouse.entries()).map(([warehouseId, data]) => ({
      warehouseId: Number(warehouseId),
      palletInCount: data.inPallet.size,
      palletOutCount: data.outPallet.size,
      tireInCount: data.inTire,
      tireOutCount: data.outTire,
    }));

    const result = plainToInstance(MonthlyStatusCountsDto, rawData, { excludeExtraneousValues: true });
    return result;
  }


  // 각 일자별 최상위 5개 규격에 대한 데이터 조회
  async getDailyTop5StandardTypesCounts(filteringDateDto: FilteringDateDto): Promise<StandardTypesDailyCountsDto[]> {
    const filterDto = new FilteringJobHistoryDto();
    filterDto.jobStartDate =  filteringDateDto.startDate;
    filterDto.jobEndDate = filteringDateDto.endDate; 
    filterDto.warehouseType = WAREHOUSE_TYPE.CRANE;

    // 1. repository에서 필터링된 모든 데이터 가져오기
    const allData = await this.jobHistoryRepository.getFilteredList({ filter: filterDto });
    const completeData = this.jobHistoryService.getStackedCompleteEntities(allData);
  
    // 2. 날짜별로 데이터 그룹화
    const groupedByDate = new Map<string, JobHistory[]>();
      
    completeData.forEach(async item => {
      const dateKey = await DateDaySplit(item.job_date) // YYYY-MM-DD 형식
        
      if (groupedByDate.has(dateKey)) {
        groupedByDate.get(dateKey)!.push(item);
      } else {
        groupedByDate.set(dateKey, [item]);
      }
    });
  
    // 3. 날짜 범위 내 모든 날짜에 대해 결과 생성
    let currentDate = filterDto.jobStartDate ? new Date(filterDto.jobStartDate) : new Date();
    let endDate = filterDto.jobEndDate ? new Date(filterDto.jobEndDate) : new Date();
    let dailyRecords: any[] = [];  // 레코드에 존재하지 않는 날짜 포함 날짜 범위 내 모든 날짜에 대한 개수 반환할 배열
  
    while (currentDate <= endDate) {
      const dateStr = await DateDaySplit(currentDate) // YYYY-MM-DD 형식
      const dayData = groupedByDate.get(dateStr) || [];
        
      // 해당 날짜의 최상위 5개 standardType 선택
      const topStandardTypesForDay = await this.getTopStandardTypesForDay(dayData, 5);
  
      dailyRecords.push({
        date: dateStr,
        items: topStandardTypesForDay
      });
        
      currentDate.setDate(currentDate.getDate() + 1);  // 하루씩 추가
    }
      
    return dailyRecords;
  }


  // 조회 기간 내 최상위 5개 standardType 조회
  private async getTopStandardTypesForDay(
    data: JobHistory[]
    , topLimit : number = 5
  ): Promise<{ standardType: string, recordCount: number }[]> {
    // standardType별로 그룹화하고 개수 계산
    const groupedData = new Map<string, number>();

    data.forEach(item => {
      const standardType = item.standard_type;
      if (groupedData.has(standardType)) {
        groupedData.set(standardType, groupedData.get(standardType)! + item.st_count);  // 이미 존재할 시 개수 +1
      } else {
        groupedData.set(standardType, item.st_count);  // 존재하지 않을 시 새로 생성
      }
    });

    // 개수 기준 내림차순 정렬하고 상위 5개만 선택
    const topResults = Array.from(groupedData.entries())
      .map(([standardType, recordCount]) => ({
        standardType: standardType,
        recordCount
      }))
      .sort((a, b) => b.recordCount - a.recordCount)  // 개수 기준 내림차순 정렬
      .slice(0, topLimit);  // 상위 5개 선택

    return topResults;
  }
}