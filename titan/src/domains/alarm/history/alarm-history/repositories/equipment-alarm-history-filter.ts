import { Brackets, SelectQueryBuilder } from "typeorm";
import { AlarmHistory } from "../entities/alarm-history.entity";
import { FilteringEquipmentAlarmHistoryDto } from "../sub-domain/equipment-alarm-history/dto/request/filtering-equipment-alarm-history.dto";
import { convertRawToArray } from "src/utils/dummy.util";

export enum EquipmentAlarmHistoryOrderKey {
  EAH_ID = 'equipment_alarm_history.id',
}


export const makeEahFilteredQueryBuilder = (
  queryBuilder: SelectQueryBuilder<AlarmHistory>,
  filter: FilteringEquipmentAlarmHistoryDto,
): SelectQueryBuilder<AlarmHistory> => {

  if (filter.alarmId) {
    queryBuilder.andWhere('equipment_alarm_history.alarm_id = :alarmId', {
      alarmId: filter.alarmId,
    });
  }

  if (filter.equipmentCode) {
    queryBuilder.andWhere('equipment_alarm_history.equipment_code = :equipmentCode', {
      equipmentCode: filter.equipmentCode,
    });
  }

  if (filter.importanceList) {
    const importanceList = convertRawToArray(filter.importanceList);
    if (importanceList.length > 0) {
      queryBuilder.andWhere('alarm.importance IN (:...importanceList)', { importanceList });
    }
  }

  if (filter.keyword && filter.keywordTypeList) {
    const keyword = filter.keyword.trim();
    const keywordTypeList = convertRawToArray(filter.keywordTypeList);

    if (keyword && keywordTypeList.length > 0) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          for (const keywordType of keywordTypeList) {
            switch (keywordType) {
              case 'equipment_type':
                qb.orWhere('equipment_alarm_history.equipment_name ILIKE :keyword', { keyword: `%${keyword}%` });
                break;
              case 'alarm_code':
                qb.orWhere('alarm.code ILIKE :keyword', { keyword: `%${keyword}%` });
                break;
              case 'alarm_description':
                qb.orWhere('alarm.description ILIKE :keyword', { keyword: `%${keyword}%` });
                break;
              case 'user_name':
                qb.orWhere(new Brackets((subQb) => {
                  subQb.where('manager_users.name ILIKE :keyword', { keyword: `%${keyword}%` });
                  // .orWhere('process_users.name ILIKE :keyword', { keyword: `%${keyword}%` });
                }));
                break;
            }
          }
        }),
      );
    }
  }

  return queryBuilder;
};