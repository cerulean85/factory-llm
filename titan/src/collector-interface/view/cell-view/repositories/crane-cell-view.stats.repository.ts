import { Injectable } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { BaseSqlRepository } from "src/common/database/base-sql-repository";
import { parsePgTextArray, toNum } from "src/utils/database.util";

export interface  StandardTypeCountByWarehouseRaw {
  warehouse_id: number;
  standard_type: string;
  count: number;
};

export interface  PalletCountByWarehouseRaw {
  warehouse_id: number;
  count: number;
}

export interface CraneCountsByWarehouseRow {
  warehouse_id: number | string;
  loc_unit: string;
  total: number | string;
  current: number | string;
  enabled: number | string;
  disabled: number | string;
  unassigned: number | string;
  // pg의 text[]는 보통 string[]로 오지만 환경에 따라 '{A,B}' 문자열로 올 수도 있어 대비
  standard_type_list: string[] | string | null;
};


@Injectable()
export class CraneCellViewStatsRepository extends BaseSqlRepository{
  constructor(@InjectDataSource() dataSource: DataSource) {
    super(dataSource);
  }

  async getCurrentCraneCountsByWarehouse(): Promise<CraneCountsByWarehouseRow[]> {
    const sql = 
      `
      SELECT
        cv.warehouse_id, cv.loc_unit,
        COUNT(*)                                                                                        AS total,
        COUNT(*) FILTER (WHERE cv.pallet_id IS NOT NULL AND cv.luggage_flag = TRUE)                     AS current,
        COUNT(*) FILTER (WHERE cv.enable = TRUE)                                                        AS enabled,
        COUNT(*) FILTER (WHERE cv.enable = FALSE)                                                       AS disabled,
        COUNT(*) FILTER (WHERE cv.pallet_id IS NULL)                                                    AS unassigned,
        ARRAY_AGG(DISTINCT cv.standard_type ORDER BY cv.standard_type)
          FILTER (WHERE cv.standard_type IS NOT NULL AND cv.standard_type <> '')                        AS standard_type_list
      FROM cell_view AS cv
      LEFT JOIN warehouse AS w ON w.id = cv.warehouse_id
      WHERE w.type = 'CRANE'
      GROUP BY cv.warehouse_id, cv.loc_unit
      ORDER BY cv.warehouse_id, cv.loc_unit
      `
      const rows = await this.runQuery<CraneCountsByWarehouseRow>(sql, [], false);
      return rows;
  }


  async getWarehouseUsingPalletCountRaw(): Promise<PalletCountByWarehouseRaw[]> {
    const sql = 
      `
      SELECT 
        cv.warehouse_id,
        COUNT(DISTINCT cv.pallet_id) AS count
      FROM cell_view AS cv
      LEFT JOIN pallet AS p ON p.id = cv.pallet_id
      LEFT JOIN warehouse AS w ON w.id = cv.warehouse_id
      WHERE cv.enable = true AND cv.pallet_id IS NOT NULL AND cv.luggage_flag = true AND w.type = 'CRANE'
      GROUP BY cv.warehouse_id
      ORDER BY cv.warehouse_id
      `
      const raw = await this.runQuery<StandardTypeCountByWarehouseRaw>(sql, [], false);

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
      LEFT JOIN pallet AS p on p.id = cv.pallet_id
      LEFT JOIN warehouse AS w ON w.id = cv.warehouse_id
      WHERE cv.enable = true AND cv.pallet_id IS NOT NULL AND cv.luggage_flag = true AND w.type = 'CRANE'
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