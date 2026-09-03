import * as dotenv from 'dotenv';
import * as path from 'path';
process.env.NODE_ENV = 'development';
const envFilePath = `.env.${process.env.NODE_ENV}`;
dotenv.config({ path: path.resolve(process.cwd(), envFilePath) });

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from 'src/app.module';
import { initializeTransactionalContext } from 'typeorm-transactional';

let app: INestApplication;

export const setupTestApp = async (): Promise<INestApplication> => {
  if (!app) {
    initializeTransactionalContext(); // 트랜잭션을 위한 초기화
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  }

  return app;
};

export const closeTestApp = async () => {
  if (app) {
    await app.close();
  }
};