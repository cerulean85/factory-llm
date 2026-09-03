import { Injectable } from "@nestjs/common";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { Pagination } from "src/utils/pagination.util";
import { BaseSqlRepository } from "src/common/database/base-sql-repository";

type StandardTypeCountByWarehouseRaw = {
  warehouse_id: number;
  standard_type: string;
  count: number;
};

@Injectable()
export class GantryJobHistoryStatsRepository extends BaseSqlRepository{
  constructor(@InjectDataSource() dataSource: DataSource) {
    super(dataSource);
  }

  async getWarehouseStandardTypeCountRaw(
  ): Promise<StandardTypeCountByWarehouseRaw[]> {
    const sql =
      `
      SELECT 
        e.warehouse_id,
        jh.standard_type,
        COUNT(*) AS count
      FROM job_history AS jh
      LEFT JOIN warehouse AS w ON w.id = jh.warehouse_id
      WHERE warehouse.type = 'GANTRY' AND jh.task_type = 'OUTPUT'
      GROUP BY jh.warehouse_id, jh.standard_type
      ORDER BY jh.warehouse_id, jh.standard_type;
    `;

    const raw = await this.runQuery<StandardTypeCountByWarehouseRaw>(sql, [], false);

    return raw.map((row: any) => ({
      warehouse_id: Number(row.warehouse_id),
      standard_type: row.standard_type,
      count: Number(row.count),
    }));
  }
}