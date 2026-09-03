import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { addTransactionalDataSource } from 'typeorm-transactional';
import { DataSource, DataSourceOptions } from 'typeorm';
import { envToBool } from 'src/utils/env.util';

export const databaseConfig = {
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_DATABASE,
  ssl: envToBool(process.env.DATABASE_SSL) ? { rejectUnauthorized: false } : undefined,
} as const

// export const databaseOrmConfig: TypeOrmModuleOptions = {
//   name: 'default',
//   type: databaseConfig.type,
//   host: databaseConfig.host,
//   port: Number(databaseConfig.port),
//   username: databaseConfig.username,
//   password: databaseConfig.password,
//   database: databaseConfig.database,
//   entities: [__dirname + '/../**/*.entity{.ts,.js}'],
//   synchronize: true,                                    // 애플리케이션 시작 시 자동으로 테이블을 생성하거나 업데이트
//   logging: false,                                        // SQL 쿼리 로그 출력 여부
//   //migrations: [__dirname + '/../migrations/*.ts'],    // 마이그레이션 파일 위치
//   // cli: {
//   //   migrationsDir: 'src/migrations',                 // CLI 명령어로 마이그레이션 생성 시 디렉토리
//   // },
// };

export const databaseOrmConfigAsync = {
  useFactory() {
    return {
      name: 'default',
      type: databaseConfig.type,
      host: databaseConfig.host,
      port: Number(databaseConfig.port),
      username: databaseConfig.username,
      password: databaseConfig.password,
      database: databaseConfig.database,
      ssl: databaseConfig.ssl,
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: envToBool(process.env.DATABASE_SYNCHRONIZE),
      logging: false,
    };
  },
  dataSourceFactory: async (option): Promise<DataSource> => {
    if (!option) throw new Error('Invalid options passed');
    return addTransactionalDataSource(new DataSource(option));
  },
};