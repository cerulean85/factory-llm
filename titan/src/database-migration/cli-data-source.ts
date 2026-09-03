import 'reflect-metadata';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.production' });

import { DataSource } from 'typeorm';
import { join } from 'path';

export default new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  username: String(process.env.DATABASE_USERNAME ?? ''),
  password: String(process.env.DATABASE_PASSWORD ?? ''),
  database: String(process.env.DATABASE_DATABASE ?? ''),
  ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
  entities: [join(__dirname, '/../**/*.entity.{ts,js}')],
  migrations: [join(__dirname, './migrations/*.{ts,js}')],
  synchronize: false,
});