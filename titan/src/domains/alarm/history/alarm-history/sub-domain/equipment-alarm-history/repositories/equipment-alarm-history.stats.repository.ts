import { Injectable } from "@nestjs/common";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { EquipmentAlarmHistory } from "../entities/equipment-alarm-history.entity";
import { DataSource, Repository } from "typeorm";
import { Pagination } from "src/utils/pagination.util";
import { BaseSqlRepository } from "src/common/database/base-sql-repository";

type EquipmentAlarmStatsRaw = {
  equipment_name: string;
  total_count: number;
  process_count: number;
  process_rate: number;
};

type DailyAlarmStatsRaw = {
  date: string;
  day_total_count: number;
  day_process_count: number;
  day_process_rate: number;
};

@Injectable()
export class EquipmentAlarmHistoryStatsRepository extends BaseSqlRepository{
  constructor(@InjectDataSource() dataSource: DataSource) {
    super(dataSource);
  }

  async getAlarmStatsGroupedByEquipment(
    startDate: Date,
    endDate: Date,
  ): Promise<EquipmentAlarmStatsRaw[]> {
    const sql =
      `
      SELECT
        e.name AS equipment_name,
        COUNT(ah.id) AS total_count,
        COUNT(ah.process_date) AS process_count,
        ROUND(
          CASE 
            WHEN COUNT(ah.id) = 0 THEN 0
            ELSE COUNT(ah.process_date)::decimal / COUNT(ah.id) * 100
          END, 
          2 
        ) AS process_rate
      FROM
        equipment e
      LEFT JOIN equipment_alarm_history ea ON ea.equipment_code = e.code
      LEFT JOIN alarm_history ah ON ea.alarm_history_id = ah.id
        AND ah.type = 'EQUIPMENT'
        AND ah.create_date BETWEEN $1 AND $2
      GROUP BY
        e.name
      ORDER BY
        e.name;
    `;

    const raw = await this.runQuery<EquipmentAlarmStatsRaw>(sql, [startDate, endDate], false);

    return raw.map((row: any) => ({
      equipment_name: row.equipment_name,
      total_count: Number(row.total_count),
      process_count: Number(row.process_count),
      process_rate: Number(row.process_rate),
    }));
  }

  
  async getEquipmentAlarmStatsGroupedByDate(
    startDate: Date,
    endDate: Date,
  ): Promise<DailyAlarmStatsRaw[]> {
    const sql = `
      WITH date_series AS (
        SELECT
          generate_series(
            $1::date,
            $2::date,
            INTERVAL '1 day'
          )::date AS date
      )
      SELECT
        TO_CHAR(ds.date, 'YYYY-MM-DD') AS date,
        COUNT(ah.id) AS day_total_count,
        COUNT(ah.process_date) AS day_process_count,
        ROUND(
          CASE 
            WHEN COUNT(ah.id) = 0 THEN 0
            ELSE COUNT(ah.process_date)::decimal / COUNT(ah.id) * 100
          END, 
          2
        ) AS process_rate
      FROM
        date_series ds
      LEFT JOIN alarm_history ah
        ON DATE(ah.create_date) = ds.date AND ah.type = 'EQUIPMENT'
      GROUP BY
        ds.date
      ORDER BY
        ds.date;
    `;

    const raw = await this.runQuery<DailyAlarmStatsRaw>(sql, [startDate, endDate], false);

    return raw.map(r => ({
      date: r.date,
      day_total_count: Number(r.day_total_count),
      day_process_count: Number(r.day_process_count),
      day_process_rate: Number(r.day_process_rate),
    }));
  }
}