import { Logger, Injectable } from '@nestjs/common';
import { JobHistoryRepository } from './repositories/job-history.repository';
import { FilteringJobHistoryDto } from './dto/request/filtering-job-history.dto';
import { EQUIPMENT_TYPE, TASK_TYPE, WAREHOUSE_TYPE } from 'src/common/enum/equipment.enum';
import { FilteringDateDto } from 'src/common/dto/filtering-date.dto';
import { DateDaySplit } from 'src/utils/date-transform.util';
import { DailyStatusCountsDto } from './dto/response/daily-status-counts.dto';
import { DailyStandardTypeCountsDto } from './dto/response/daily-standard-type-counts.dto';
import { JobHistoryService } from './job-history.service';
import { JobHistoryOrderKey } from './repositories/job-history.base.repository';
import { ORDER } from 'src/common/enum/db.enum';
import { InOutCountsByStandardTypeDto as InOutCountByStandardTypeDto } from './dto/response/in_out_counts_by_standard_type.dto';

@Injectable()
export class GantryJobHistoryService {
  private readonly logger = new Logger(GantryJobHistoryService.name)

  constructor(
    private readonly jobHistoryRepository: JobHistoryRepository,
    private readonly jobHistoryService: JobHistoryService,
  ) {}



  // 일별 적치량(+누적량) 조회
  async getDailyGantryStackedCounts(filterDto: FilteringJobHistoryDto): Promise<DailyStatusCountsDto[]> {
    filterDto.warehouseType = WAREHOUSE_TYPE.GANTRY;

    // 1. Repository에서 필터링된 모든 데이터 가져오기
    const allData = await this.jobHistoryRepository.getFilteredList({ filter: filterDto });
    const workingComplete = this.jobHistoryService.getStackedCompleteEntities(allData);

    // 2. 날짜별로 그룹화 및 개수 집계
    const groupByDate = new Map<string, number>();
    
    workingComplete.forEach(item => {
      const dateKey = DateDaySplit(item.job_date); // YYYY-MM-DD 형식
      if (groupByDate.has(dateKey)) {
        // 조회된 날짜가 이미 존재
        let prevCnt = groupByDate.get(dateKey) ?? 0;
        const calcCnt = prevCnt + item.st_count;
        groupByDate.set(dateKey, calcCnt);
      } else {
        // 조회된 날짜가 이전에 없을 시
        groupByDate.set(dateKey, item.st_count);
      }
    });

    // 3. 현재 및 누적 적치량 집계
    let currentDate = filterDto.jobStartDate ? new Date(filterDto.jobStartDate) : new Date();
    let endDate = filterDto.jobEndDate ? new Date(filterDto.jobEndDate) : new Date();

    let result: {date: string, currentCount: number, cumulativeCount: number}[] = [];
    let cumulativeCount = 0;
    while (currentDate <= endDate) {
      const dateStr = DateDaySplit(currentDate);
      //const dateStr = currentDate.toISOString().split('T')[0]; // YYYY-MM-DD 형식
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

  
  // 조회 기간 내 Gantry 창고에서 출고된 데이터 개수 조회 (todo Service에 사용됨)
  async getGantryCounts(filterDto : FilteringJobHistoryDto): Promise<number> {
    filterDto.warehouseType = WAREHOUSE_TYPE.GANTRY;

    const resultCount = await this.jobHistoryRepository.getFilteredCount({ filter: filterDto });
    return resultCount;
  }

  // standardType에 따른 일별 데이터 개수 조회 (적치된 날짜 기준으로?) (이전 이름: getDailyCountsByType)
  async getDailyGantryCountsByStandardType(standardTypes: string[], filterJhDto: FilteringJobHistoryDto): Promise<DailyStandardTypeCountsDto[]> {
    
    // Repository에서 필터링된 모든 데이터 가져오기
    const allData = await this.jobHistoryRepository.getFilteredList({ 
      filter: filterJhDto,
      orderMap: {[JobHistoryOrderKey.JOB_DATE]: ORDER.DESC}
    });
    const workingComplete = this.jobHistoryService.getStackedCompleteEntities(allData);

    // 입력된 standardTypes 데이터만 필터링
    const filteredStData = workingComplete.filter(item => standardTypes.includes(item.standard_type));
    
    
    // 날짜+타입 조합으로 그룹화 및 개수 집계
    const groupedByDateAndType = new Map<string, number>();
    
    for (const item of filteredStData) {
      if (item.job_date === null) continue;

      const dateKey = await DateDaySplit(item.job_date);
      const compositeKey = `${dateKey}_${item.standard_type}`;

      const prev = groupedByDateAndType.get(compositeKey) ?? 0;
      const add  = item.st_count ?? 0;
      groupedByDateAndType.set(compositeKey, prev + add);
    }

    // 날짜 범위 내 모든 날짜에 대해 결과 생성
    let currentDate = filterJhDto.jobStartDate ? filterJhDto.jobStartDate : filterJhDto.jobEndDate;
    let endDate = filterJhDto.jobEndDate ? new Date(filterJhDto.jobEndDate) : new Date();
    let dailyRecords: DailyStandardTypeCountsDto[] = [];  // 반환할 배열

    while (currentDate <= endDate) {
      const dateStr = await DateDaySplit(currentDate);
      
      // 각 standardType에 대해 데이터 생성 (레코드에 존재하지 않는 날짜 포함 날짜 범위 내 모든 날짜에 대해 결과 생성)
      standardTypes.forEach(standardType => {
        const compositeKey = `${dateStr}_${standardType}`;
        const recordCount = groupedByDateAndType.get(compositeKey) || 0;
        // groupedByDateAndType에 데이터가 있으면 해당 데이터 가져오고, 아니면 0으로 설정
        
        dailyRecords.push({
          date: dateStr,
          standardType,
          recordCount
        });
      });
      
      currentDate.setDate(currentDate.getDate() + 1);  // 하루씩 추가
    }

    return dailyRecords;
  }

  
  // standardType에 따른 입고 출고 개수 조회
  async getGantryInOutCountsByStandardType(standardTypes: string[], filterJhDto: FilteringJobHistoryDto): Promise<InOutCountByStandardTypeDto[]> {
    
    filterJhDto.standardType = '';
    filterJhDto.warehouseType = WAREHOUSE_TYPE.GANTRY;

    // Repository에서 필터링된 모든 데이터 가져오기
    const allData = await this.jobHistoryRepository.getFilteredList({ 
      filter: filterJhDto,
      orderMap: {[JobHistoryOrderKey.JOB_DATE]: ORDER.DESC}
    });
    const workingComplete = this.jobHistoryService.getStackedCompleteEntities(allData);

    // 입력된 standardTypes 데이터만 필터링
    const filteredStData = workingComplete.filter(item => standardTypes.includes(item.standard_type));
    
    
    const agg = new Map<string, InOutCountByStandardTypeDto>();
    
    for (const st of standardTypes) {
      agg.set(st, { standardType: st, outCount: 0, stackedCount: 0 });
    }

    for (const item of filteredStData) {
      const key = item.standard_type;
      const dto =
        agg.get(key) ??
        (() => {
          const created = { standardType: key, outCount: 0, stackedCount: 0 };
          agg.set(key, created);
          return created;
        })();

      if (item.task_type === TASK_TYPE.OUTPUT) {
        dto.outCount += item.st_count;
      } else if (item.task_type === TASK_TYPE.INPUT) {
        dto.stackedCount += item.st_count;
      }
    }

    const inOutCountList: InOutCountByStandardTypeDto[] = standardTypes.map(
      (st) => agg.get(st)!
    );

    return inOutCountList;
  }
}