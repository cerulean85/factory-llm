import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository, SelectQueryBuilder  } from 'typeorm';

import { Alarm } from '../entities/alarm.entity';
import { CreateAlarmDto } from '../dto/request/create-alarm.dto';
import { UpdateAlarmDto } from '../dto/request/update-alarm.dto';
import { Pagination } from 'src/utils/pagination.util';
import { FilteringAlarmDto } from '../dto/request/filtering-alarm.dto';
import { PaginationResponseDto } from 'src/common/dto/pagination-response.dto';
import { PaginationRequestDto } from 'src/common/dto/pagination-request.dto';
import { QueryRunner } from 'typeorm';
import { In } from 'typeorm';
import { convertRawToArrayWithComma } from 'src/utils/dummy.util';
import { makeQuerybuilderToSql } from 'src/utils/database.util';
import { query } from 'express';
import { ALARM_HISTORY_TYPE } from 'src/common/enum/alarm.enum';
import { ORDER } from 'src/common/enum/db.enum';
import { BaseRepositoryContract } from 'src/common/repository/base-repository-contract';

export interface IAlarmQueryOptions {
  filter?: FilteringAlarmDto;
  joinUsers?: boolean;
  joinEquipmentType?: boolean;
  orderMap?: Partial<Record<AlarmOrderKey, ORDER>>;
}

export enum AlarmOrderKey{
  ID = 'alarm.id',
  CREATE_DATE = 'alarm.create_date'
}


@Injectable()
export class AlarmBaseRepository extends BaseRepositoryContract<Alarm, IAlarmQueryOptions> {
  constructor(
    @InjectRepository(Alarm)
    protected readonly repository: Repository<Alarm>,
    protected readonly pagination : Pagination
  ) { super(repository, pagination) }

  protected initializeDefaultOptions(options: IAlarmQueryOptions = {}): Required<IAlarmQueryOptions> {
    return {
      filter: options.filter ?? new FilteringAlarmDto(),
      joinUsers: options.joinUsers ?? true,
      joinEquipmentType: options.joinEquipmentType ?? true,
      orderMap: options.orderMap ?? {},
    };
  }

  protected createQueryBuilder(
    options: IAlarmQueryOptions
  ): SelectQueryBuilder<Alarm> {
    const {filter, joinUsers, joinEquipmentType, orderMap} = this.initializeDefaultOptions(options);
    const queryBuilder = this.createJoinQueryBuilder(joinUsers, joinEquipmentType);
    const filteredQb = this.makeFilteredQueryBuilder(queryBuilder, filter);
    const orderedQb = this.makeOrderedQueryBuilder(filteredQb, orderMap);

    return orderedQb;
  }

  protected createJoinQueryBuilder(
    joinEquipmentType: boolean = true,
    joinUsers: boolean = true,
  ): SelectQueryBuilder<Alarm> {
    const queryBuilder = this.repository.createQueryBuilder('alarm');

    // equipment_type 조인
    if (joinEquipmentType) {
      queryBuilder
        .leftJoinAndSelect('alarm.equipment_type', 'equipment_type');
    }

    // user 조인 (조건부)
    if (joinUsers) {
      queryBuilder
        .leftJoin('alarm_user_relation', 'relation', 'relation.alarm_id = alarm.id')
        .leftJoinAndMapMany(
          'alarm.user_list',
          'users',
          'users',
          'relation.user_seq_id = users.seq_id',
        );
    }

    // select
    queryBuilder.select([
      'alarm.id',
      'alarm.code',
      'alarm.type',
      'alarm.description',
      'alarm.importance',
      'alarm.create_date',
      'alarm.update_date',
      'alarm.process_method',
      'alarm.file_id_list',
      'alarm.send_enabled',
      'alarm.reset_available',

      ...(joinEquipmentType ? [
        'equipment_type.id',
        'equipment_type.name',
      ] : []),

      ...(joinUsers ? [
        'users.seq_id',
        'users.user_id',
        'users.name',
        'users.email',
        'users.phone_number',
      ] : []),
    ]);

    return queryBuilder;
  }


  protected makeFilteredQueryBuilder(
    queryBuilder: SelectQueryBuilder<Alarm>,
    filter: FilteringAlarmDto
  ): SelectQueryBuilder<Alarm> {

    // 알람 유형
    const rawAlarmType = filter.alarmTypeList;
    let alarmTypeList: string[] = [];
    if (rawAlarmType && Array.isArray(rawAlarmType)) {
      alarmTypeList = rawAlarmType.map(type => String(type).toUpperCase()).filter(type => type !== '');
    }
    if (alarmTypeList.length > 0) {
      queryBuilder.andWhere('alarm.type IN (:...alarmTypeList)', { alarmTypeList });
    }

    // 중요도
    const rawImportance = filter.importanceList;
    let importanceList: number[] = [];
    if (rawImportance && rawImportance.trim() !== '') {
      importanceList = rawImportance.split(',').map(importance => Number(importance.trim())).filter(importance => !isNaN(importance));
    }

    if (importanceList.length > 0) {
      queryBuilder.andWhere('alarm.importance IN (:...importanceList)', { importanceList });
    }

    // 알람 매뉴얼 등록유무
    if (filter.manualValid === 'true') {
      queryBuilder.andWhere('COALESCE(array_length(file_id_list, 1), 0) > 0');
    } else if (filter.manualValid === 'false') {
      queryBuilder.andWhere('COALESCE(array_length(file_id_list, 1), 0) = 0');
    };

    // 알람 전송 여부
    if (filter.sendEnabled == 'true') {
      queryBuilder.andWhere('alarm.send_enabled = :sendEnabled', { sendEnabled: true });
    } else if (filter.sendEnabled == 'false') {
      queryBuilder.andWhere('alarm.send_enabled = :sendEnabled', { sendEnabled: false });
    }

    // 키워드 필터링
    const keyword = filter.keyword || '';
    const keywordTypeList = convertRawToArrayWithComma(filter.keywordTypeList || '');

    if (keyword && keyword.trim().length > 0 && keywordTypeList.length > 0) {
      const brackets = new Brackets((qb) => {
        for (let i = 0; i < keywordTypeList.length; i++) {
          const column = this.getKeywordColmumn(keywordTypeList[i]);
          if (column === '') continue;
      
          if (i === 0) {
            qb.where(`${column} ILIKE :keyword`, { keyword: `%${keyword}%` });
          } else {
            qb.orWhere(`${column} ILIKE :keyword`, { keyword: `%${keyword}%` });
          }
        }
      });
      queryBuilder.andWhere(brackets);
    }

    if (filter.id) {
      queryBuilder.andWhere('alarm.id = :id', { id: filter.id });
    }

    if (filter.validRecord) {
      queryBuilder.andWhere('alarm.valid_record = :validRecord', { validRecord: filter.validRecord });
    }

    if (filter.code) {
      queryBuilder.andWhere('alarm.code = :code', { code: filter.code });
    }

    if (filter.equipmentTypeId) {
      queryBuilder.andWhere('equipment_type.id = :equipmentTypeId', { equipmentTypeId: filter.equipmentTypeId });
    }

    return queryBuilder;
  }

  getKeywordColmumn = (_keywordType: string) => { 
    const keywordType = _keywordType.replaceAll("'", '')
    switch (keywordType) {
      case 'equipment':
        return 'equipment_type.name';
      case 'alarm_code':
        return 'alarm.code';
      case 'alarm_description':
        return 'alarm.description';
      case 'user_name':
        return 'users.name';
      default: return '';
    }
  }
}