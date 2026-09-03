import { Injectable } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { BaseSqlRepository } from "src/common/database/base-sql-repository";
import { DataSource } from "typeorm";



@Injectable()
export class AlarmHistoryStatsRepository extends BaseSqlRepository{
  constructor(@InjectDataSource() dataSource: DataSource) {
    super(dataSource);
  }

}