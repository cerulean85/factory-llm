import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { DataSource, QueryRunner } from 'typeorm';

@Injectable()
export class IndexCheckService implements OnModuleInit {
  private readonly logger = new Logger(IndexCheckService.name)
  constructor(private readonly dataSource: DataSource) {}

  async onModuleInit() {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    try {
      const indexTasks = [
        {
          table: 'alarm_history',
          index: 'idx_alarm_type_date_desc',
          columns: 'type, create_date DESC',
        },
        {
          table: 'alarm_user_relation',
          index: 'idx_alarm_user_relation_alarm_id',
          columns: 'alarm_id',
        },
        {
          table: 'alarm_user_relation',
          index: 'idx_alarm_user_relation_user_seq_id',
          columns: 'user_seq_id',
        },
        {
          table: 'alarm_history_process_by_user',
          index: 'idx_ahpbu_alarm_history_id',
          columns: 'alarm_history_id',
        },
        {
          table: 'alarm_history_process_by_user',
          index: 'idx_ahpbu_user_seq_id',
          columns: 'user_seq_id',
        },
        {
          table: 'users',
          index: 'idx_users_seq_id',
          columns: 'seq_id',
        },
        {
          table: 'equipment_alarm_history',
          index: 'idx_ea_alarm_history_id',
          columns: 'alarm_history_id',
        },
        {
          table: 'inventory_alarm_history',
          index: 'idx_ia_alarm_history_id',
          columns: 'alarm_history_id',
        },
        {
          table: 'alarm',
          index: 'idx_alarm_id_equipment_id',
          columns: 'id, equipment_id',
        },
        {
          table: 'equipment',
          index: 'idx_equipment_id_type_id',
          columns: 'id, equipment_type_id',
        },
        {
          table: 'equipment_type',
          index: 'idx_equipment_type_id',
          columns: 'id',
        },

      ];

      for (const task of indexTasks) {
        await this.ensureIndex(queryRunner, task.table, task.index, task.columns);
      }

    } catch (error) {
      this.logger.error('Error occurred during index check:', error);
    } finally {
      await queryRunner.release();
    }
  }

  private async hasIndex(queryRunner: QueryRunner, tableName: string, indexName: string): Promise<boolean> {
    const result = await queryRunner.query(`
      SELECT 1
      FROM pg_indexes
      WHERE tablename = '${tableName}'
        AND indexname = '${indexName}'
    `);
    return result.length > 0;
  }

  private async ensureIndex(queryRunner: QueryRunner, tableName: string, indexName: string, columns: string) {
    const exists = await this.hasIndex(queryRunner, tableName, indexName);
    if (!exists) {
      await queryRunner.query(`
        CREATE INDEX ${indexName}
        ON ${tableName}(${columns})
      `);
      this.logger.log(`Index [${indexName}] created on table [${tableName}].`);
    } else {
      this.logger.log(`Index [${indexName}] already exists on table [${tableName}].`);
    }
  }
}