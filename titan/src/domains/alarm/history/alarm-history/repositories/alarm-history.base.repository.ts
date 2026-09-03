import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { AlarmHistory } from '../entities/alarm-history.entity';
import { Pagination } from 'src/utils/pagination.util';
import { PaginationResponseDto } from 'src/common/dto/pagination-response.dto';
import { 
  convertRawToArrayWithComma,
 } from 'src/utils/dummy.util';
import { ORDER } from 'src/common/enum/db.enum';
import { FilteringAlarmHistoryDto } from '../dto/request/filtering-alarm-history.dto';
import { CreateAlarmHistoryDto } from '../dto/request/create-alarm-history.dto';
import { UpdateAlarmHistoryDto } from '../dto/request/update-alarm-history.dto';
import { ALARM_HISTORY_PROCESS_FLAG } from 'src/common/enum/alarm.enum';
import { BaseRepositoryContract } from 'src/common/repository/base-repository-contract';
import { EquipmentAlarmHistoryOrderKey, makeEahFilteredQueryBuilder } from './equipment-alarm-history-filter';
import { InventoryAlarmHistoryOrderKey, makeIahFilteredQueryBuilder } from './inventory-alarm-history-filter';
import { makePahFilteredQueryBuilder, PalletAlarmHistoryOrderKey } from './pallet-alarm-history-filter';
 
export interface IAlarmHistoryQueryOptions {
  filter?: FilteringAlarmHistoryDto;
  joinProcessUsers? : boolean;
  joinEquipmentAlarm? : boolean;
  joinInventoryAlarm? : boolean;
  joinPalletAlarm? : boolean;
  orderMap?: Partial<Record<AlarmHistoryOrderKey, ORDER>>;
}

export enum AlarmHistoryBaseOrderKey{
  ID = 'alarm_history.id',
  CREATE_DATE = 'alarm_history.create_date'
}

export type AlarmHistoryOrderKey =
  | AlarmHistoryBaseOrderKey
  | EquipmentAlarmHistoryOrderKey
  | InventoryAlarmHistoryOrderKey
  | PalletAlarmHistoryOrderKey
  ;



@Injectable()
export class AlarmHistoryBaseRepository extends BaseRepositoryContract<AlarmHistory, IAlarmHistoryQueryOptions>{
  constructor(
    @InjectRepository(AlarmHistory)
    protected readonly repository: Repository<AlarmHistory>,
    protected readonly pagination: Pagination,
  ) { super(repository, pagination)}

  async createAlarmHistory(createAlarmHistoryDto: CreateAlarmHistoryDto): Promise<AlarmHistory> {
    const newAlarmHistory = this.repository.create(createAlarmHistoryDto);
    return await this.repository.save(newAlarmHistory);
  }

  async insertAlarmHistory(alarmHistoryList: AlarmHistory): Promise<AlarmHistory> {
    return await this.repository.save(alarmHistoryList);
  }

  async insertAlarmHistoryList(alarmHistoryList: AlarmHistory[]): Promise<AlarmHistory[]> {
    return await this.repository.save(alarmHistoryList);
  }


  async updateProcess(alarmHistoryId: number, processMessage: string, processDate: Date = new Date()): Promise<boolean> {
    try {
      //update_date가 자동으로 업데이트 되지 않는 typeORM의 버그!
      const result = await this.repository.update(alarmHistoryId, {
        process_date: processDate,
        process_message: processMessage,
        update_date: new Date(),
      });
      return result.affected !== undefined && result.affected !== null && result.affected > 0;

    } catch (error) {
      throw new InternalServerErrorException('DB Connection Error');
    }
  } 


  async updateAlarmHistory(alarmHistory: AlarmHistory, updateAlarmHistoryDto?: UpdateAlarmHistoryDto): Promise<boolean> {
    this.repository.merge(alarmHistory, {
      ...updateAlarmHistoryDto
    });

    const result =  await this.repository.save(alarmHistory);
    return result ? true : false;
  }


  async updateProcessMessage(alarmHistoryId: number, processMessage: string, processDate: Date = new Date()): Promise<boolean> {
    try {
      // const entity = await this.alarmHistoryRepo.findOneByOrFail({ id: alarmHistoryId });
      // entity.process_date = processDate;
      // entity.process_message = processMessage;

      //update_date가 자동으로 업데이트 되지 않는 typeORM의 버그!
      const result = await this.repository.update(alarmHistoryId, {
        process_date: processDate,
        process_message: processMessage,
        update_date: new Date(),
      });
      return result.affected !== undefined && result.affected !== null && result.affected > 0;

    } catch (error) {
      throw new InternalServerErrorException('DB Connection Error');
    }
  } 

  initializeDefaultOptions(
    options: IAlarmHistoryQueryOptions= {}
  ): Required<IAlarmHistoryQueryOptions> {
    return {
      filter: options.filter ?? new FilteringAlarmHistoryDto(),
      joinProcessUsers: options.joinProcessUsers ?? true,
      joinEquipmentAlarm: options.joinEquipmentAlarm ?? true,
      joinInventoryAlarm: options.joinInventoryAlarm ?? true,
      joinPalletAlarm: options.joinPalletAlarm ?? true,
      orderMap: options.orderMap ?? {},
    };
  }

  createQueryBuilder(
    options: IAlarmHistoryQueryOptions
  ): SelectQueryBuilder<AlarmHistory> {
    const {filter, joinProcessUsers, joinEquipmentAlarm, joinInventoryAlarm, joinPalletAlarm, orderMap} = this.initializeDefaultOptions(options);
    const joinQb = this.createJoinQueryBuilder(joinProcessUsers, joinEquipmentAlarm, joinInventoryAlarm, joinPalletAlarm);
    const filteredQb = this.makeFilteredQueryBuilder(joinQb, filter);
    const orderedQb = this.makeOrderedQueryBuilder(filteredQb, orderMap);
    return orderedQb;
  }

  createJoinQueryBuilder(
    joinProcessUsers: boolean = true,
    joinEquipmentAlarm: boolean = true,
    joinInventoryAlarm: boolean = true,
    joinPalletAlarm: boolean = true,
  ): SelectQueryBuilder<AlarmHistory> {

    const qb = this.repository.createQueryBuilder('alarm_history');
      
    if (joinProcessUsers) {
      qb.leftJoin('alarm_history_process_by_user', 'relation', 'relation.alarm_history_id = alarm_history.id')
        .leftJoinAndMapMany(
          'alarm_history.process_user_list',              //알람 히스토리에 process_user_list의 객체를 만들어줌
          'users',                                        // users랑 조인하는데
          'process_users',                                // 그 별칭은 process_users로 정의할거야
          'relation.user_seq_id = process_users.seq_id',  // relation.user_~ 랑 조인할거야. 그 결과를 process_user_list에 담아주는 것
        );
    }


    if (joinEquipmentAlarm){
      qb.leftJoinAndSelect('alarm_history.equipment_alarm_history', 'equipment_alarm_history')
      qb.leftJoinAndSelect('equipment_alarm_history.alarm', 'alarm')
      qb.leftJoinAndSelect('alarm.equipment_type', 'equipment_type')
      qb.leftJoin('alarm_user_relation', 'alarmUserRelation', 'alarmUserRelation.alarm_id = alarm.id')
        .leftJoinAndMapMany(
          'alarm.manager_user_list',
          'users',
          'manager_users',
          'alarmUserRelation.user_seq_id = manager_users.seq_id',
        )
    }

    if (joinInventoryAlarm){
      qb.leftJoinAndSelect('alarm_history.inventory_alarm_history', 'inventory_alarm_history')
    }

    if (joinPalletAlarm){
      qb.leftJoinAndSelect('alarm_history.pallet_alarm_history', 'pallet_alarm_history')
    }

    /*
    qb.select([
      'alarm_history.id',
      'alarm_history.create_date',
      'alarm_history.update_date',
      'alarm_history.process_date',
      'alarm_history.message',
      'alarm_history.process_message',
      'alarm_history.type',

      ...(joinProcessUsers ? [
        'process_users.seq_id',
        'process_users.user_id',
        'process_users.name',
        'process_users.phone_number',
        'process_users.email',
      ] : []),

      ...(joinEquipmentAlarm ? [
        'equipment_alarm_history.id',
        'equipment_alarm_history.alarm',
      ] : []),
    ]);
    */
    return qb;
  }

  makeFilteredQueryBuilder(queryBuilder: SelectQueryBuilder<AlarmHistory>, filter: FilteringAlarmHistoryDto): SelectQueryBuilder<AlarmHistory> {
    if(filter.alarmHistoryId){
      queryBuilder.andWhere('alarm_history.id = :alarmHistoryId', {
        alarmHistoryId: filter.alarmHistoryId,
      });
    }

    if (filter.alarmTypeList){
      if (filter.alarmTypeList.length > 0) {
        queryBuilder.andWhere('alarm_history.type IN (:...alarmTypeList)', { alarmTypeList: filter.alarmTypeList });
      }
    }

    //생성 날짜 필터링
    if (filter.alarmStartDate && filter.alarmEndDate) {
      queryBuilder.andWhere('alarm_history.create_date BETWEEN :startDate AND :endDate', {
        startDate: filter.alarmStartDate,
        endDate: filter.alarmEndDate,
      });
    } else if (filter.alarmStartDate) {
      queryBuilder.andWhere('alarm_history.create_date >= :startDate', {
        startDate: filter.alarmStartDate,
      });
    } else if (filter.alarmEndDate) {
      queryBuilder.andWhere('alarm_history.create_date <= :endDate', {
        endDate: filter.alarmEndDate,
      });
    }
    
    //처리 날짜 필터링
    if(filter.processType === ALARM_HISTORY_PROCESS_FLAG.PROCESSED){
      if (filter.processStartDate && filter.processEndDate) {
        queryBuilder.andWhere('alarm_history.process_date BETWEEN :processStartDate AND :processEndDate', {
          processStartDate: filter.processStartDate,
          processEndDate: filter.processEndDate,
        });
      } else if (filter.processStartDate) {
        queryBuilder.andWhere('alarm_history.process_date >= :processStartDate', {
          processStartDate: filter.processStartDate,
        });
      } else if (filter.processEndDate) {
        queryBuilder.andWhere('alarm_history.process_date <= :processEndDate', {
          processEndDate: filter.processEndDate,
        });
      }
    } else if (filter.processType === ALARM_HISTORY_PROCESS_FLAG.UNPROCESSED){
      queryBuilder.andWhere('alarm_history.process_date IS NULL', {
        processStartDate: filter.processStartDate,
      });
    }

    if(filter.filteringEquipmentAlarmHistory){
      queryBuilder = makeEahFilteredQueryBuilder(queryBuilder, filter.filteringEquipmentAlarmHistory);
    }

    if(filter.filteringInventoryAlarmHistory){
      queryBuilder = makeIahFilteredQueryBuilder(queryBuilder, filter.filteringInventoryAlarmHistory);
    }

    if(filter.filteringPalletAlarmHistory){
      queryBuilder = makePahFilteredQueryBuilder(queryBuilder, filter.filteringPalletAlarmHistory);
    }


    return queryBuilder;
  }
}
