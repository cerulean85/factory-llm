import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), `.env.${process.env.NODE_ENV || 'development'}`) });

import { Client } from 'pg';

async function ensureDatabase() {
  const host = process.env.DATABASE_HOST || 'localhost';
  const port = Number(process.env.DATABASE_PORT || 5432);
  const user = process.env.DATABASE_USERNAME || 'postgres';
  const pass = process.env.DATABASE_PASSWORD || 'admin123!';
  const db   = process.env.DATABASE_DATABASE || 'titan';

  const admin = new Client({ host, port, user, password: pass, database: 'postgres' });
  await admin.connect();

  const res = await admin.query('SELECT 1 FROM pg_database WHERE datname = $1', [db]);
  const exists = res.rowCount > 0;

  if (!exists) {
    await admin.query(`CREATE DATABASE "${db}" OWNER "${user}" ENCODING 'UTF8' TEMPLATE template1;`);
    console.log(`[db-init] created database "${db}"`);
  } else {
    console.log(`[db-init] database "${db}" already exists`);
  }

  await admin.end();
}

ensureDatabase().catch((e) => {
  console.error('[db-init] failed:', e);
  process.exit(1);
});
