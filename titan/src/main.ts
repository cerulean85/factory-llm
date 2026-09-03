import * as dotenv from 'dotenv';
import * as path from 'path';
const envFilePath =
  process.env.NODE_ENV === 'production'
    ? '.env.production'
    : '.env.development';
dotenv.config({ path: path.resolve(process.cwd(), envFilePath) });

import { ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ensureDatabaseExists } from './utils/database.util';
import { CustomLogger } from './utils/logger.util';
import { winstonLogger } from './config/winston-logger.config';
import { initializeTransactionalContext } from 'typeorm-transactional';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { GlobalControllerExceptionFilter } from './utils/filter.util';
import { ResponseInterceptor } from './utils/interceptor';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { DebugDatabaseResetService } from './dev-tools/debug-database-reset.service';
import { databaseConfig } from './config/database.config';
import { SeedService } from './seeds/seed.service';

async function bootstrap() {
  initializeTransactionalContext(); // 트랜잭션을 위한 초기화
  await ensureDatabaseExists();

  // 테스트 데이터 초기화 로직
  const resetService = new DebugDatabaseResetService(
    {
      host: databaseConfig.host!,
      port: Number(databaseConfig.port),
      user: databaseConfig.username!,
      password: databaseConfig.password!,
      database: databaseConfig.database!,
      ssl: databaseConfig.ssl,
    },
    SeedService.SEED_VERSION,
  );
  await resetService.runResetIfNeeded();

  // const app = await NestFactory.create(AppModule, {logger: winstonLogger});
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: winstonLogger,
  });

  // Trust proxy 설정 추가 - IP 정보를 더 정확하게 추출
  app.set('trust proxy', 1);

  app.useGlobalPipes(new ValidationPipe({ transform: true })); // DTO 유효성 검사 활성화
  app.enableCors();

  app.useStaticAssets(path.resolve(process.cwd(), 'dist', 'files'), {
    prefix: '/dist/files',
  });

  const config = new DocumentBuilder()
    .setTitle('API 문서')
    .setDescription('NestJS로 만든 API입니다.')
    .setVersion('1.0')
    .addTag('example') // 선택사항
    .build();

  const document = SwaggerModule.createDocument(app, config);
  // ❗ DTO 스키마를 Swagger에 반영
  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true, // 인증 유지
    },
  });

  const reflector = app.get(Reflector);
  app.useGlobalFilters(new GlobalControllerExceptionFilter(reflector));
  app.useGlobalInterceptors(new ResponseInterceptor());
  await app.listen(process.env.SERVICE_PORT || 3300);
}
bootstrap();
