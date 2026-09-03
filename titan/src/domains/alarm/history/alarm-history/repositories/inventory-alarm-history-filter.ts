import { Brackets, SelectQueryBuilder } from "typeorm";
import { AlarmHistory } from "../entities/alarm-history.entity";
import { FilteringInventoryAlarmHistoryDto } from "../sub-domain/inventory-alarm-history/dto/request/filtering-inventory-alarm-history.dto";

export enum InventoryAlarmHistoryOrderKey {
  IAH_ID = 'inventory_alarm_history.id',
}


export const makeIahFilteredQueryBuilder = (
  queryBuilder: SelectQueryBuilder<AlarmHistory>,
  filter: FilteringInventoryAlarmHistoryDto,
): SelectQueryBuilder<AlarmHistory> => {

    if (filter.inventoryAlarmType) {
      queryBuilder.andWhere('inventory_alarm_history.inventory_alarm_type = :inventoryAlarmType', {
        inventoryAlarmType: filter.inventoryAlarmType,
      })
    };

    if (filter.standardType) {
      queryBuilder.andWhere('inventory_alarm_history.standard_type = :standardType', {
        standardType: filter.standardType,
      })
    };

    if (filter.warehouseName) {
      queryBuilder.andWhere('inventory_alarm_history.warehouse_name = :warehouseName', {
        warehouseName: filter.warehouseName,
      })
    };

    if (filter.warehouseCode) {
      queryBuilder.andWhere('inventory_alarm_history.warehouse_code = :warehouseCode', {
        warehouseCode: filter.warehouseCode,
      })
    };

    if (filter.warehouseType) {
      queryBuilder.andWhere('inventory_alarm_history.warehouse_type = :warehouseType', {
        warehouseType: filter.warehouseType,
      })
    };

  return queryBuilder;
};