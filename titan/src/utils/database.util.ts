import { Client } from 'pg';
import { databaseConfig } from '../config/database.config';
import { Logger } from '@nestjs/common';
import { QueryBuilder } from 'typeorm';
import { format } from 'sql-formatter';
import { DateDaySplit, DateTimeSplit } from './date-transform.util';

export async function ensureDatabaseExists() {
  const logger = new Logger('ensureDatabaseExists');

  const client = new Client({
    user: databaseConfig.username,
    host: databaseConfig.host,
    password: databaseConfig.password,
    port: databaseConfig.port,
    database: databaseConfig.database || 'postgres',
    ssl: databaseConfig.ssl,
  });

  try {

    await client.connect();

    const res = await client.query(
      `SELECT 1 FROM pg_database WHERE datname = '${databaseConfig.database}';`
    );

    if (res.rowCount === 0) {
      await client.query(`CREATE DATABASE titan;`);
      logger.log('Create Database titan');
    } 
  } catch (error) {
    logger.log('ensureDatabaseExists :', error);
  } finally {
    await client.end();
  }
}

export function makeQuerybuilderToSql(queryBuilder: QueryBuilder<any>): string {
  let sql = queryBuilder.getQuery();
  const parameters = queryBuilder.getParameters();

  for (const [key, value] of Object.entries(parameters)) {
    let replacement: string;

    if (Array.isArray(value)) {
      const escapedArray = value.map((v) =>
        typeof v === 'string'
          ? `'${v.replace(/'/g, "''")}'`
          : v instanceof Date
            ? `'${DateTimeSplit(v)}'`
            : v
      );
      replacement = escapedArray.join(', ');

      // spread parameter 처리 (:...key)
      const spreadRegex = new RegExp(`:...${key}\\b`, 'g');
      sql = sql.replace(spreadRegex, replacement);
    } else {
      replacement = typeof value === 'string'
        ? `'${value.replace(/'/g, "''")}'`
        : value instanceof Date
          ? `'${DateTimeSplit(value)}}'`
          : String(value);

      // 일반 파라미터 처리 (:key)
      const normalRegex = new RegExp(`:${key}\\b`, 'g');
      sql = sql.replace(normalRegex, replacement);
    }
  }

  try {
    sql = format(sql, { language: 'postgresql' });
    console.log('SQL DEBUG :\n', sql);
  } catch (error) {
    console.error('SQL formatting error:', error);
    console.log('SQL DEBUG :\n', sql);
  }

  return sql;
}

export const toNum = (v: unknown): number =>
  v == null ? 0 : typeof v === 'number' ? v : Number(v);


// 유틸: pg 배열 파싱 (string[]이면 그대로, '{A,B}'면 파싱)
export const parsePgTextArray = (v: unknown): string[] => {
  if (Array.isArray(v)) return (v as unknown[]).filter(x => x != null).map(String);
  if (typeof v === 'string') {
    const s = v.trim();
    if (s.startsWith('{') && s.endsWith('}')) {
      const inner = s.slice(1, -1);
      if (!inner) return [];
      // 간단 파서: ," 로 감싼 값/이스케이프 기본 처리
      return inner
        .split(',')
        .map(x => x.replace(/^"(.*)"$/, '$1').replace(/\\"/g, '"'));
    }
    return [s];
  }
  return [];
};
