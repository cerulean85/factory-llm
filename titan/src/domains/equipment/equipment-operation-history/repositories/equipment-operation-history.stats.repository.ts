import { Injectable } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { BaseSqlRepository } from "src/common/database/base-sql-repository";


export interface EquipmentOperationAggregationRaw {
  equipment_id: number;
  equipment_code: string;
  equipment_name: string;
  equipment_type_id: number;
  equipment_type_name: string;
  start_minutes: number;
  stop_minutes: number;
  fault_minutes: number;
  availablility_rate: number;
  fault_rate: number;
  final_status_at_end_ts: string;
  current_status_at_now: string;
};

export interface OperationDetailRaw{
  equipment_id: number;
  seg_from: string;
  seg_to: string;
  status: string;
  minutes: number;
  equipment_operation_history_id: number | null;
  operation_maintenance_type: string | null;
  description: string | null;
}



@Injectable()
export class EquipmentOperationHistoryStatsRepository extends BaseSqlRepository{
  constructor(@InjectDataSource() dataSource: DataSource) {
    super(dataSource);
  }
  
  async getOperationDetail(
    startDate: string,
    endDate: string,
  ): Promise<OperationDetailRaw[]> {

    let sql = this.createAggCte();
    sql += 
      `
        SELECT
          equipment_id,
          TO_CHAR(seg_from, 'YYYY-MM-DD HH24:MI:SS') AS seg_from,
          TO_CHAR(seg_to, 'YYYY-MM-DD HH24:MI:SS') AS seg_to,
          status,
          minutes,
          equipment_operation_history_id,
          operation_maintenance_type,
          description
        FROM summed   
        ORDER BY equipment_id, seg_from
      `;
    const raw = await this.runQuery<OperationDetailRaw>(sql, [startDate, endDate], false);
    return raw;
  }


  async getEquipmentOperationAggregation(
    startDate: string,
    endDate: string,
  ): Promise<EquipmentOperationAggregationRaw[]> {
    let sql = this.createAggCte();
    sql +=
      `
        -- 9) end_ts 기준 최후 상태 계산
        -- end_ts 이전까지의 마지막 유효 이벤트를 가져오고, 없으면 START로 기본값
        , final_status AS (
          SELECT
            eq.equipment_id,
            COALESCE((
              SELECT ce.status_norm
              FROM clean_events ce
              WHERE ce.equipment_id = eq.equipment_id
                AND ce.status_norm IS NOT NULL
              ORDER BY ce.ts DESC
              LIMIT 1
            ), 'START') AS end_status
          FROM equip eq
        )

        -- 10) 현재 시점(now) 기준 최종 상태
        , current_status_now AS (
          SELECT
            eq.equipment_id,
            CASE 
              WHEN latest.status_norm IS NULL THEN 'START'             -- 아예 row가 없으면 START
              ELSE latest.status_norm                          -- row가 있으면 최신 정상 상태
            END AS current_status
          FROM equip eq
          LEFT JOIN LATERAL (
            SELECT
              CASE 
                WHEN UPPER(e2.operation_status) IN ('START','STOP','FAULT') THEN UPPER(e2.operation_status)
              END AS status_norm
            FROM equipment_operation_history e2
            WHERE e2.equipment_id = eq.equipment_id
              AND (
                UPPER(e2.operation_status) IN ('START','STOP','FAULT')
              )
            ORDER BY e2.create_date DESC
            LIMIT 1
          ) latest ON TRUE
        )

        SELECT
          eq.equipment_id,
          eq.equipment_code,
          eq.equipment_name,
          eq.equipment_type_id,
          eq.equipment_type_name,
          COALESCE(SUM(s.minutes) FILTER (WHERE s.status='START'), 0)::bigint AS start_minutes,
          COALESCE(SUM(s.minutes) FILTER (WHERE s.status='STOP'),  0)::bigint AS stop_minutes,
          COALESCE(SUM(s.minutes) FILTER (WHERE s.status='FAULT'), 0)::bigint AS fault_minutes,
          CASE 
            WHEN COALESCE(SUM(s.minutes), 0) = 0 THEN 0::numeric
            ELSE ROUND(
              COALESCE(SUM(s.minutes) FILTER (WHERE s.status='START'), 0)
              / SUM(s.minutes) * 100::numeric,
              2
            )
          END AS availablility_rate,  -- 가동률 (%)
          CASE 
            WHEN COALESCE(SUM(s.minutes), 0) = 0 THEN 0::numeric
            ELSE ROUND(
              COALESCE(SUM(s.minutes) FILTER (WHERE s.status='FAULT'), 0)
              / SUM(s.minutes) * 100::numeric,
              2
            )
          END AS fault_rate,
          fs.end_status AS final_status_at_end_ts,
          csn.current_status AS current_status_at_now
        FROM equip eq
        LEFT JOIN summed s      ON s.equipment_id = eq.equipment_id
        LEFT JOIN final_status fs ON fs.equipment_id = eq.equipment_id
        LEFT JOIN current_status_now csn ON csn.equipment_id = eq.equipment_id
        GROUP BY eq.equipment_id, eq.equipment_code, eq.equipment_name, eq.equipment_type_id,
            eq.equipment_type_name, fs.end_status, csn.current_status
        ORDER BY eq.equipment_id;
    `;

    const raw = await this.runQuery<EquipmentOperationAggregationRaw>(sql, [startDate, endDate], false);
    return raw;
  }

  createAggCte() : string {
    const cteSql =
      `
        WITH params AS (
          SELECT 
            $1::timestamptz AS start_ts,
            $2::timestamptz AS end_ts
        )

        -- 0) 설비 전체 집합 (항상 equipment 테이블 기준으로 모두 포함)
        , equip AS (
          SELECT e.id AS equipment_id,
            e.code AS equipment_code,
            e.name AS equipment_name,
            et.id AS equipment_type_id,
            et.name AS equipment_type_name
          FROM equipment AS e
          LEFT JOIN equipment_type AS et ON et.id = e.equipment_type_id
          WHERE et.type IN ('STC', 'GTR', 'RGV')
          
        )

        -- 1) 상태 정제: START/STOP/FAULT만 사용
        , clean_events AS (
          SELECT
            e.equipment_id,
          e.operation_status AS status_norm,
            e.create_date AS ts,
          e.id AS equipment_operation_history_id,
          e.operation_maintenance_type AS operation_maintenance_type,
          e.description AS description
          FROM equipment_operation_history e
          JOIN params p ON e.create_date < p.end_ts
          WHERE e.operation_status IN ('START', 'STOP', 'FAULT')
        )

        -- 2) [start_ts) 직전의 마지막 상태 (없으면 NULL)
        , last_before_start AS (
          SELECT DISTINCT ON (ce.equipment_id)
                ce.equipment_id,
                ce.status_norm AS status,
            ce.equipment_operation_history_id AS equipment_operation_history_id,
            ce.operation_maintenance_type AS operation_maintenance_type,
            ce.description AS description
          FROM clean_events ce
          JOIN params p ON ce.ts < p.start_ts
          ORDER BY ce.equipment_id, ce.ts DESC
        )

        -- 3) 윈도우 시작 시점에 초기 상태 심기 (없으면 START로 간주)
        , initial_at_window AS (
          SELECT 
            eq.equipment_id,
            COALESCE(lbs.status, 'START') AS status,  -- 기본 START
            p.start_ts AS ts,
            lbs.equipment_operation_history_id AS equipment_operation_history_id,
            lbs.operation_maintenance_type AS operation_maintenance_type,
            lbs.description AS description
          FROM equip eq
          CROSS JOIN params p
          LEFT JOIN last_before_start lbs ON lbs.equipment_id = eq.equipment_id
        )

        -- 4) 윈도우 내 이벤트 (정제된 상태만)
        , in_range_events AS (
          SELECT 
          ce.equipment_id, ce.status_norm AS status, 
          ce.ts,
          ce.equipment_operation_history_id AS equipment_operation_history_id,
          ce.operation_maintenance_type AS operation_maintenance_type,
          ce.description AS description
          FROM clean_events ce
          JOIN params p ON ce.ts >= p.start_ts AND ce.ts < p.end_ts
        )

        -- 5) 타임라인 결합 + 윈도우 끝 경계 추가
        , change_points AS (
          SELECT * FROM initial_at_window
          UNION ALL
          SELECT * FROM in_range_events
        )

        , bounded_points AS (
          SELECT 
          cp.equipment_id, 
          cp.status, 
          cp.ts,
          cp.equipment_operation_history_id,
          cp.operation_maintenance_type,
          cp.description
          FROM change_points cp
          UNION ALL
          SELECT 
          eq.equipment_id, 
          NULL::text AS status, 
          p.end_ts AS ts,
          NULL::int AS equipment_operation_history_id,
          NULL::text AS operation_maintenance_type,
          NULL::text AS description
          FROM equip eq CROSS JOIN params p
        )

        -- 6) 연속 구간으로 변환 (상태 carry-forward)
        , sequenced AS (
          SELECT
            equipment_id,
            ts AS seg_start,
            LEAD(ts) OVER (PARTITION BY equipment_id ORDER BY ts) AS seg_end,
            LAST_VALUE(status) OVER (
              PARTITION BY equipment_id
              ORDER BY ts
              ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
            ) AS curr_status,
          equipment_operation_history_id,
          operation_maintenance_type,
          description
          FROM bounded_points
        )

        -- 7) 기간 경계로 자르고 유효 구간만
        , cut AS (
          SELECT
            s.equipment_id,
            GREATEST(s.seg_start, p.start_ts) AS seg_from,
            LEAST(s.seg_end,   p.end_ts)     AS seg_to,
            s.curr_status,
          s.equipment_operation_history_id,
          s.operation_maintenance_type,
          s.description	
          FROM sequenced s
          JOIN params p ON TRUE
          WHERE s.seg_end IS NOT NULL
            AND GREATEST(s.seg_start, p.start_ts) < LEAST(s.seg_end, p.end_ts)
        )

        -- 8) 상태별 초 합산
        , summed AS (
          SELECT
            equipment_id,
            curr_status AS status,
          seg_from,
          seg_to,
            SUM(EXTRACT(EPOCH FROM (seg_to - seg_from)) / 60.0)::numeric(20,3) AS minutes,
          equipment_operation_history_id,
          operation_maintenance_type,
          description
          FROM cut
          WHERE curr_status IN ('START','STOP','FAULT')
          GROUP BY equipment_id, curr_status, seg_from, seg_to, equipment_operation_history_id, operation_maintenance_type, description
        )
    `;
    return cteSql;
  }

}