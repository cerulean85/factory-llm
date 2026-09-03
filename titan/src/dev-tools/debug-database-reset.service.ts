import { Client } from 'pg';

export class DebugDatabaseResetService {
  private client: Client;

  constructor(
    private config: {
      host: string;
      port: number;
      user: string;
      password: string;
      database: string;
      ssl?: any;
    },
    private readonly targetVersion: number // ex: 1.1
  ) {
    this.client = new Client(this.config);
  }

  async runResetIfNeeded() {
    try {
      await this.client.connect();

      const tableExists = await this.checkIfSeedOptionTableExists();

      if (!tableExists) {
        await this.createSeedOptionTable();
        await this.insertSeedOptionVersion(0.0); // 초기 버전 삽입
      }

      const currentVersion = await this.getCurrentDatabaseVersion();

      if (currentVersion >= this.targetVersion) {
        console.log(`SeedOption version is up to date (${currentVersion} >= ${this.targetVersion}). Skipping reset.`);
        return;
      }

      console.log(`Resetting DB because version ${currentVersion} < ${this.targetVersion}`);
      await this.clearAllTables();
      await this.updateDatabaseVersion(this.targetVersion);
    } catch (err) {
      console.error('Error during database reset:', err);
      throw err;
    } finally {
      await this.client.end();
    }
  }

  private async checkIfSeedOptionTableExists(): Promise<boolean> {
    const result = await this.client.query(`
      SELECT EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_schema = 'public'
          AND table_name = 'seed_option'
      ) AS exists;
    `);
    return result.rows[0].exists;
  }

  private async createSeedOptionTable() {
    await this.client.query(`
      CREATE TABLE seed_option (
        id SERIAL PRIMARY KEY,
        database_version DOUBLE PRECISION DEFAULT 1.0
      );
    `);
  }

  private async insertSeedOptionVersion(version: number) {
    await this.client.query(
      `INSERT INTO seed_option (database_version) VALUES ($1);`,
      [version]
    );
  }

  private async getCurrentDatabaseVersion(): Promise<number> {
    const result = await this.client.query(`SELECT database_version FROM seed_option ORDER BY id DESC LIMIT 1;`);
    return Number(result.rows[0]?.database_version ?? 0.0);
  }

  private async updateDatabaseVersion(version: number) {
    const res = await this.client.query(`UPDATE seed_option SET database_version = $1;`, [version]);
    if (res.rowCount === 0) {
      await this.client.query(`INSERT INTO seed_option (database_version) VALUES ($1);`, [version]);
    }
  }

  private async clearAllTables() {
    await this.client.query('BEGIN');

    try {
      // 1. 모든 뷰 삭제 (public 스키마)
      const viewsResult = await this.client.query(`
        SELECT table_name
        FROM information_schema.views
        WHERE table_schema = 'public'
      `);

      for (const row of viewsResult.rows) {
        const viewName = row.table_name;
        console.log(`Dropping view: ${viewName}`);
        await this.client.query(`DROP VIEW IF EXISTS "${viewName}" CASCADE`);
      }

      // 2. 모든 일반 테이블 조회 (뷰 및 seed_option 제외)
      const tablesResult = await this.client.query(`
        SELECT relname AS tablename
        FROM pg_class
        JOIN pg_namespace ON pg_namespace.oid = pg_class.relnamespace
        WHERE pg_namespace.nspname = 'public'
          AND pg_class.relkind = 'r'  -- ordinary table
          AND relname != 'seed_option'
      `);

      if (tablesResult.rows.length > 0) {
        const tableNames = tablesResult.rows.map((r) => `"${r.tablename}"`).join(', ');
        console.log(`Truncating tables: ${tableNames}`);
        await this.client.query(`TRUNCATE TABLE ${tableNames} RESTART IDENTITY CASCADE`);
      }

      await this.client.query('COMMIT');
    } catch (error) {
      await this.client.query('ROLLBACK');
      throw error;
    }
  }
}