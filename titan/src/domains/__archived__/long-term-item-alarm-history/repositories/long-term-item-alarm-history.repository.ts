import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { AlarmHistory } from '../../../alarm/history/alarm-history/entities/alarm-history.entity';
import { Pagination } from 'src/utils/pagination.util';
import { PaginationResponseDto } from 'src/common/dto/pagination-response.dto';
import { ORDER } from 'src/common/enum/db.enum';
import { FilteringAlarmHistoryDto } from '../../../alarm/history/alarm-history/dto/request/filtering-alarm-history.dto';
import { ALARM_HISTORY_PROCESS_FLAG } from 'src/common/enum/alarm.enum';
import { FilteringLongTermItemAlarmHistoryDto } from '../dto/request/filtering-long-term-item-alarm-history.dto';
import { LongTermItemAlarmHistory } from '../entities/long-term-item-alarm-history.entity';
import { CreateLongTermItemAlarmHistoryDto } from '../dto/request/create-long-term-item-alarm-history.dto';
 
interface ILongTermItemAlarmHistoryQueryOptions {
  filter?: FilteringLongTermItemAlarmHistoryDto
  joinWarehouse? : boolean;
  joinProcessUsers? : boolean;
  orderByCreateDate?: ORDER;
}

@Injectable()
export class LongTermItemAlarmHistoryRepository {
  constructor(
    @InjectRepository(LongTermItemAlarmHistory)
    private readonly repo: Repository<LongTermItemAlarmHistory>,
    private readonly pagination: Pagination,
  ) {}

  async getFilteredList(options: ILongTermItemAlarmHistoryQueryOptions = {}): Promise<LongTermItemAlarmHistory[]> {
    const queryBuilder = this.createQueryBuilder(options);
    const result = await queryBuilder.getMany();
    return result;
  }

  async getFilteredOne(
    options: ILongTermItemAlarmHistoryQueryOptions = {}
  ): Promise<LongTermItemAlarmHistory | null> {
    const queryBuilder = this.createQueryBuilder(options);
    return await queryBuilder.getOne();
  }

  async getFilteredLimit(
    limit: number,
    options: ILongTermItemAlarmHistoryQueryOptions = {}
  ): Promise<LongTermItemAlarmHistory[]> {
    const queryBuilder = this.createQueryBuilder(options);
    queryBuilder.limit(limit);
    return await queryBuilder.getMany();
  }

  async getFilteredPaginatedList(
    options: ILongTermItemAlarmHistoryQueryOptions = {}
  ): Promise<PaginationResponseDto<LongTermItemAlarmHistory>> {
    const queryBuilder = this.createQueryBuilder(options);
    const filter = options.filter? options.filter : new FilteringAlarmHistoryDto()
    const result = await this.pagination.paginateWithQueryBuilder(queryBuilder, filter);
    return result;
  }

  async getListByIds(
    alarmHistoryIds : number[], 
    options: ILongTermItemAlarmHistoryQueryOptions = {}
  ): Promise<LongTermItemAlarmHistory[]> {
    const queryBuilder = this.createQueryBuilder(options)
          .where('alarmHistory.id IN (:...alarmHistoryIds)', { alarmHistoryIds });
    const alarmHistoryList = await queryBuilder.getMany();
    return alarmHistoryList;
  }

  async createLongTermItemAlarmHistory(alarmHistory: AlarmHistory, createDto :CreateLongTermItemAlarmHistoryDto): Promise<LongTermItemAlarmHistory> {
    const newAlarmHistory = this.repo.create({alarm_history : alarmHistory, ...createDto});
    return await this.repo.save(newAlarmHistory);
  }


  private initializeDefaultOptions(
    options: ILongTermItemAlarmHistoryQueryOptions= {}
  ): Required<ILongTermItemAlarmHistoryQueryOptions> {
    return {
      filter: options.filter ?? new FilteringLongTermItemAlarmHistoryDto(),
      joinWarehouse : options.joinWarehouse ?? true,
      joinProcessUsers : options.joinProcessUsers ?? true,
      orderByCreateDate: options.orderByCreateDate ?? ORDER.DEFAULT,
    };
  }

  private createQueryBuilder(
    options: ILongTermItemAlarmHistoryQueryOptions = {}
  ): SelectQueryBuilder<LongTermItemAlarmHistory> {
    const filteredOption = this.initializeDefaultOptions(options);

    const joinQb = this.createJoinQueryBuilder(filteredOption.joinWarehouse, filteredOption.joinProcessUsers);

    const filteredQb = this.makeFilteredQueryBuilder(joinQb, filteredOption.filter);
    const orderedQb = this.makeOrderedQueryBuilder(filteredQb, options.orderByCreateDate);
    return orderedQb;
  }

  private createJoinQueryBuilder(
    joinWarehouse: boolean,
    joinProcessUsers: boolean
  ): SelectQueryBuilder<LongTermItemAlarmHistory> {

    const qb = this.repo
      .createQueryBuilder('long_term_item_alarm_history');

    qb.leftJoinAndSelect('long_term_item_alarm_history.alarm_history', 'alarm_history');

    if (joinWarehouse){
      qb.leftJoinAndSelect('alarm_history.warehouse', 'warehouse');
    }

    if (joinProcessUsers) {
      qb.leftJoin('alarm_history_process_by_user', 'relation', 'relation.alarm_history_id = alarm_history.id')
        .leftJoinAndMapMany(
          'alarm_history.process_user_list',              //알람 히스토리에 process_user_list의 객체를 만들어줌
          'users',                                        // users랑 조인하는데
          'process_users',                                // 그 별칭은 process_users로 정의할거야
          'relation.user_seq_id = process_users.seq_id',  // relation.user_~ 랑 조인할거야. 그 결과를 process_user_list에 담아주는 것
        );
    }



    qb.select([
      'long_term_item_alarm_history.id',
      'long_term_item_alarm_history.standard_type',
      'long_term_item_alarm_history.long_term_item_count',

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

      'warehouse.id',
      'warehouse.type',
    ]);
    

    return qb;
  }

  private makeFilteredQueryBuilder(queryBuilder: SelectQueryBuilder<LongTermItemAlarmHistory>, filter: FilteringLongTermItemAlarmHistoryDto): SelectQueryBuilder<LongTermItemAlarmHistory> {
    if (filter.alarmHistoryId) {
      queryBuilder.andWhere('alarm_history.id = :alarmHistoryId', {
        alarmHistoryId: filter.alarmHistoryId,
      })
    };
    
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

    if (filter.standardType) {
      queryBuilder.andWhere('long_term_item_alarm_history.standard_type = :standardType', { standardType: filter.standardType });
    }

    return queryBuilder;
  }

  private makeOrderedQueryBuilder(
    queryBuilder: SelectQueryBuilder<LongTermItemAlarmHistory>,
    orderByCreateDate: ORDER = ORDER.DEFAULT
  ): SelectQueryBuilder<LongTermItemAlarmHistory> {
    if (orderByCreateDate === ORDER.ASC) {
      queryBuilder.orderBy('alarm_history.create_date', 'ASC');
    } else if (orderByCreateDate === ORDER.DESC) {
      queryBuilder.orderBy('alarm_history.create_date', 'DESC');
    }
    return queryBuilder;
  }
}
