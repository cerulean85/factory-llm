import { Logger } from "@nestjs/common";
import { DateDaySplit } from "src/utils/date-transform.util";
import { DataSource } from "typeorm";

export abstract class BaseSqlRepository {
  private readonly logger = new Logger(BaseSqlRepository.name)
  constructor(protected readonly dataSource: DataSource) {}

  protected async runQuery<T>(sql: string, params: any[], debug = false): Promise<T[]> {
    try{
      if (debug) {
        console.log(this.buildQueryWithParams(sql, params));
      }
      return await this.dataSource.query(sql, params);
    } catch(e){
      this.logger.debug(this.buildQueryWithParams(sql, params));
      throw e;
    }
  }

  private buildQueryWithParams(query: string, params: any[]): string {
    let i = 0;
    return query.replace(/\$\d+/g, () => {
      const value = params[i++];
      if (value instanceof Date) {
        return `'${DateDaySplit(value)}'`;
      }
      if (typeof value === 'string') {
        return `'${value}'`;
      }
      return String(value);
    });
  }
}