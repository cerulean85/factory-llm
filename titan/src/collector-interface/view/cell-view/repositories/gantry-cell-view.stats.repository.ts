import { Injectable } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { BaseSqlRepository } from "src/common/database/base-sql-repository";

export interface StandardTypeCountByWarehouseRaw {
  warehouse_id: number;
  standard_type: string;
  count: number;
};

export interface CellCountByWarehouseRaw {
  warehouse_id: number;
  count: number;
}

export interface GantryCountsByWarehouseRow {
  warehouse_id: number | string;
  warehouse_code: string;
  total: number | string;
  current: number | string;
  enabled: number | string;
  disabled: number | string;
  unassigned: number | string;
  standard_type_list: string[] | string | null;
}

@Injectable()
export class GantryCellViewStatsRepository extends BaseSqlRepository{
  constructor(@InjectDataSource() dataSource: DataSource) {
    super(dataSource);
  }

  async getCurrentGantryCountsByWarehouse(): Promise<GantryCountsByWarehouseRow[]> {
    const sql = 
      `
      SELECT
        cv.warehouse_id, w.code as warehouse_code,
        COUNT(*)                                                                                        AS total,
        COUNT(*) FILTER (WHERE cv.enable = TRUE AND cv.luggage_flag = TRUE)                             AS current,
        COUNT(*) FILTER (WHERE cv.enable = TRUE)                                                        AS enabled,
        COUNT(*) FILTER (WHERE cv.enable = FALSE)                                                       AS disabled,
        COUNT(*) FILTER (WHERE cv.luggage_flag = FALSE)                                                 AS unassigned,
        ARRAY_AGG(DISTINCT cv.standard_type ORDER BY cv.standard_type)
          FILTER (WHERE cv.standard_type IS NOT NULL AND cv.standard_type <> '')                        AS standard_type_list
      FROM cell_view AS cv
      LEFT JOIN warehouse AS w ON w.id = cv.warehouse_id
      WHERE w.type = 'GANTRY'
      GROUP BY cv.warehouse_id, w.code
      ORDER BY cv.warehouse_id
      `;

      const rows = await this.runQuery<GantryCountsByWarehouseRow>(sql, [], false);
      return rows;
  }

  async getWarehouseUsingCellCountRaw(): Promise<CellCountByWarehouseRaw[]> {
    const sql = 
      `
      SELECT 
        cv.warehouse_id,
        COUNT(DISTINCT cv.id) AS count
      FROM cell_view AS cv
      LEFT JOIN warehouse AS w ON w.id = cv.warehouse_id
      WHERE cv.enable = true AND cv.luggage_flag = true AND w.type = 'GANTRY'
      GROUP BY cv.warehouse_id
      ORDER BY cv.warehouse_id
      `
      const raw = await this.runQuery<CellCountByWarehouseRaw>(sql, [], false);

      return raw.map((row: any) => ({
      warehouse_id: Number(row.warehouse_id),
      count: Number(row.count),
    }));
  }

  async getWarehouseStandardTypeCountRaw(
  ): Promise<StandardTypeCountByWarehouseRaw[]> {
    const sql =
      `
      SELECT 
        cv.warehouse_id,
        cv.standard_type,
        SUM(cv.st_count) AS count
      FROM cell_view AS cv
      LEFT JOIN warehouse AS w ON w.id = cv.warehouse_id
      WHERE cv.enable = true AND cv.luggage_flag = true AND w.type = 'GANTRY'
      GROUP BY cv.warehouse_id, cv.standard_type
      ORDER BY cv.warehouse_id, cv.standard_type;
    `;

    const raw = await this.runQuery<StandardTypeCountByWarehouseRaw>(sql, [], false);

    return raw.map((row: any) => ({
      warehouse_id: Number(row.warehouse_id),
      standard_type: row.standard_type,
      count: Number(row.count),
    }));
  }
}