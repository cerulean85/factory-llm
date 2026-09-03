import { Logger, Injectable, NotFoundException,  InternalServerErrorException } from '@nestjs/common';

import { ShippingSpecificationRepository } from './repositories/shipping-specification.repository';
import { CreateShippingSpecificationDto } from './dto/request/create-shipping-specification.dto';
import { UpdateShippingSpecificationDto } from './dto/request/update-shipping-specification.dto';
import { ResponseStatusDto } from 'src/common/dto/response-status.dto';

import { UsersService } from '../../users/users/users.service';
import { plainToInstance } from 'class-transformer';
import { ShippingSpecificationResponseDto } from './dto/response/shipping-specification-response.dto';
import { FilteringDateDto } from 'src/common/dto/filtering-date.dto';
import { DailyShippingSpecificationDto } from './dto/response/daily-shipping-specification.dto';
import { FilteringShippingSpecificationDto } from './dto/request/filtering-shipping-specification.dto';
import { ShippingSpecification } from './entities/shipping-specification.entity';
import { MonthShipmentDto } from './dto/response/month-shipment.dto';
import { EQUIPMENT_TYPE, TASK_TYPE, WAREHOUSE_TYPE } from 'src/common/enum/equipment.enum';
import { GantryJobHistoryService } from '../job-history/gantry-job-history.service';
import { FilteringJobHistoryDto } from '../job-history/dto/request/filtering-job-history.dto';

enum MONTH_SHIPMENT_ITEM_COUNT_TYPE {
  OUT = 'OUT',
  STACKED = 'STACKED'
}

@Injectable()
export class ShippingSpecificationService {
    private readonly logger = new Logger(ShippingSpecificationService.name)
    constructor(
    private readonly shippingSpecificationRepository: ShippingSpecificationRepository,
    private readonly usersService: UsersService,
    private readonly gantryJobHistoryService: GantryJobHistoryService,
  ) {}

  async createShippingSpecification(createShippingSpecificationDto: CreateShippingSpecificationDto): Promise<ShippingSpecification> {
    const users = await this.usersService.findUsersEntityBySeqId(createShippingSpecificationDto.users_seq_id);
    if (!users) {
      this.logger.warn(`User with ID ${createShippingSpecificationDto.users_seq_id} not found`);
      throw new NotFoundException(`User with ID ${createShippingSpecificationDto.users_seq_id} not found`);
    }
    const newShippingSpecification = this.shippingSpecificationRepository.createShippingSpecification(createShippingSpecificationDto, users);
    return newShippingSpecification;
  };

  async getShippingSpecificationById(shippingSpecificationId: number): Promise<ShippingSpecification | null> {
    const filterDto = new FilteringShippingSpecificationDto();
    filterDto.shippingSpecificationId = shippingSpecificationId;
    const shippingSpecification = await this.shippingSpecificationRepository.getFilteredOne({ filter: filterDto });
    if (!shippingSpecification) {
      this.logger.warn(`ShippingSpecification not found : ${shippingSpecificationId}`);
      throw new NotFoundException(`ShippingSpecification not found : ${shippingSpecificationId}`);
    };
    return shippingSpecification;
  };

  async updateShippingSpecification(shippingSpecificationId: number, updateShippingSpecificationDto: UpdateShippingSpecificationDto): Promise<ResponseStatusDto> {
    const { users_seq_id: usersSeqId } = updateShippingSpecificationDto;
    const shippingSpecification = await this.getShippingSpecificationById(shippingSpecificationId);
    if (!shippingSpecification) {
      this.logger.warn(`shippingSpecification with ID ${shippingSpecification} not found`);
      throw new NotFoundException(`shippingSpecification with ID ${shippingSpecification} not found`);
    };
    const users = usersSeqId ? await this.usersService.findUsersEntityBySeqId(usersSeqId) : shippingSpecification.users;
    if (!users) {
      this.logger.warn(`User with ID ${usersSeqId} not found`);
      throw new NotFoundException(`User with ID ${usersSeqId} not found`);
    }
    const result = await this.shippingSpecificationRepository.updateShippingSpecification(shippingSpecification, users, updateShippingSpecificationDto);

    if (!result) {
      this.logger.warn(`Failed to update shippingSpecification with ID ${shippingSpecificationId}`);
      throw new InternalServerErrorException(`Failed to update shippingSpecification with ID ${shippingSpecificationId}`);
    };

    let resStatusDto = new ResponseStatusDto();
    resStatusDto.isSuccess = result;
    resStatusDto.message = result ? 'ShippingSpecification updated successfully' : 'Failed to update shippingSpecification';
    return resStatusDto;
  };

  async getAllShippingSpecification(): Promise<ShippingSpecificationResponseDto[]> {
    const pageRes = await this.shippingSpecificationRepository.getFilteredList();
    const result = plainToInstance(ShippingSpecificationResponseDto, pageRes, { excludeExtraneousValues: true });
    return result;
  };

  async findShippingSpecificationById(shippingSpecificationId: number): Promise<ShippingSpecificationResponseDto> {
    const shippingSpecification = await this.getShippingSpecificationById(shippingSpecificationId);
    if (!shippingSpecification) {
      this.logger.warn(`ShippingSpecification not found : ${shippingSpecificationId}`);
      throw new NotFoundException(`ShippingSpecification not found : ${shippingSpecificationId}`);
    };
    const result = plainToInstance(ShippingSpecificationResponseDto, shippingSpecification, { excludeExtraneousValues: true });
    return result;
  };

  async getStandardTypes(): Promise<string[]> {
    const data = await this.shippingSpecificationRepository.getFilteredList();
    const standardTypes = data.map(spec => spec.standard_type).filter((type, index, self) => self.indexOf(type) === index).sort((a, b) => a.localeCompare(b));
    if (standardTypes.length === 0) {
      return [];
    };
    return standardTypes;
  }

  async getDailyShippingSpecification(filteringDateDto: FilteringDateDto): Promise<DailyShippingSpecificationDto[]> {

    const standardTypes = await this.getStandardTypes();
    const filterJhDto = new FilteringJobHistoryDto();
    filterJhDto.jobStartDate = filteringDateDto.startDate;
    filterJhDto.jobEndDate = filteringDateDto.endDate;
    filterJhDto.warehouseType = WAREHOUSE_TYPE.CRANE;
    filterJhDto.taskType = TASK_TYPE.OUTPUT;

    const gantryRespot = await this.gantryJobHistoryService.getDailyGantryCountsByStandardType(standardTypes, filterJhDto);

    const grouped = gantryRespot.reduce((acc, item) => {
      const { date, standardType, recordCount } = item;
      if (!acc[date]) {
        acc[date] = {};
      }
      if (!acc[date][standardType]) {
        acc[date][standardType] = 0;
      }
      acc[date][standardType] += recordCount;
      return acc;
    }, {});

    const result = Object.entries(grouped)
    .sort(([dateA], [dateB]) => new Date(dateA).getTime() - new Date(dateB).getTime())    
    .map(([date, items]) => {
      const itemCounts = items as Record<string, number>;

      const itemsArray = standardTypes.map((type) => ({
        standardType: type,
        recordCount: itemCounts[type] || 0,
      }));

      return {
        date: date,
        items: itemsArray,
      };
    })

    return result;
  }
  
  async softDeleteShippingSpecificationById(shippingSpecificationId: number): Promise<ResponseStatusDto> {
    const result = await this.shippingSpecificationRepository.softDeleteShippingSpecificationById(shippingSpecificationId);
    if(!result){
      this.logger.warn('Failed to delete');
      throw new NotFoundException(`ShippingSpecification with ID ${shippingSpecificationId} not found`);
    };
    let resStatusDto = new ResponseStatusDto();
    resStatusDto.isSuccess = true;
    return resStatusDto;
  };


  // CurrentMonth보단 파라미터로 던지고, 프론트에서 해당 월을 주는 게 좋음
  // 이번달 중점 출고 규격의 갠트리 출하량 조회
  async getCurrentMonthShipment(): Promise<MonthShipmentDto[]> {
    const today = new Date();
    const startDate = new Date(today.getFullYear(), today.getMonth(), 1);
    const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    // 중점 출고 규격 목록
    const standardTypes = await this.getStandardTypes();

    // 모든 중점 출고 규격 0으로 초기화
    const standardTypeCount = new Map<string, { [MONTH_SHIPMENT_ITEM_COUNT_TYPE.OUT]: number, [MONTH_SHIPMENT_ITEM_COUNT_TYPE.STACKED]: number }>();
    standardTypes.forEach(type => {
      standardTypeCount.set(type, {
        [MONTH_SHIPMENT_ITEM_COUNT_TYPE.OUT]: 0,
        [MONTH_SHIPMENT_ITEM_COUNT_TYPE.STACKED]: 0,
      });
    });

    const filterJhDto = new FilteringJobHistoryDto();
    filterJhDto.standardTypes = standardTypes;
    filterJhDto.jobStartDate = startDate;
    filterJhDto.jobEndDate = endDate;
    filterJhDto.warehouseType = WAREHOUSE_TYPE.GANTRY;
    const inOutCount = await this.gantryJobHistoryService.getGantryInOutCountsByStandardType(standardTypes, filterJhDto);
    return inOutCount;
  };


  // // 월별 출하량 데이터 처리를 위한 함수, 규격별 출고량 및 적치량 개수 정리
  // private processGantryData(
  //   data: ItemLocationHistory[], 
  //   standardTypeCount: Map<string, { [MONTH_SHIPMENT_ITEM_COUNT_TYPE.OUT]: number, [MONTH_SHIPMENT_ITEM_COUNT_TYPE.STACKED]: number }>,
  //   countType: MONTH_SHIPMENT_ITEM_COUNT_TYPE
  // ): void {
  //   data.forEach(item => {
  //     const standardType = item.stored_item.standard_type;
  //     if (standardType && standardTypeCount.has(standardType)) {
  //       standardTypeCount.get(standardType)![countType] += 1;
  //     }
  //   });
  // }

  // // 입고 날짜 필터링
  // private filterByInDateRange(data: ItemLocationHistory[], startDate?: Date, endDate?: Date): ItemLocationHistory[] {
  //   return data.filter(item => {
  //     const inDate = item.in_date;
  //     if (!inDate) return false;  // 입고 날짜가 있어야 함
      
  //     if (startDate && endDate) {
  //       return inDate >= startDate && inDate <= endDate;
  //     } else if (startDate) {
  //       return inDate >= startDate;
  //     } else if (endDate) {
  //       return inDate <= endDate;
  //     }
  //     return true;
  //   });
  // }

  // // 출고 날짜 필터링
  // private filterByOutDateRange(data: ItemLocationHistory[], startDate?: Date, endDate?: Date): ItemLocationHistory[] {
  //   return data.filter(item => {
  //     const outDate = item.out_date;
  //     if (!outDate) return false;  // 출고 날짜가 있어야 함
      
  //     if (startDate && endDate) {
  //       return outDate >= startDate && outDate <= endDate;
  //     } else if (startDate) {
  //       return outDate >= startDate;
  //     } else if (endDate) {
  //       return outDate <= endDate;
  //     }
  //     return true;
  //   });
  // }
};