import { SelectQueryBuilder } from "typeorm";
import { AlarmHistory } from "../entities/alarm-history.entity";
import { FilteringPalletAlarmHistoryDto } from "../sub-domain/pallet-alarm-history/dto/request/filtering-pallet-alarm-history.dto";

export enum PalletAlarmHistoryOrderKey {
  PAH_ID = 'pallet_alarm_history.id',
}

export const makePahFilteredQueryBuilder = (
  queryBuilder: SelectQueryBuilder<AlarmHistory>,
  filter: FilteringPalletAlarmHistoryDto,
): SelectQueryBuilder<AlarmHistory> => {

  // if (filter.alarmHistoryId) {
  //   queryBuilder.andWhere('pallet_alarm_history.alarm_history_id = :alarmHistoryId', {
  //     alarmHistoryId: filter.alarmHistoryId,
  //   })
  // };

  return queryBuilder;
};