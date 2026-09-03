import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { System } from 'src/domains/setting/system/entities/system.entity';
import { DataSource } from 'typeorm';
import { setupTestApp } from './setup-e2e';
import { SystemResponseDto } from 'src/domains/setting/system/dto/response/system-response.dto';

describe('System API (e2e)', () => {
  let app: INestApplication;
  let systemRepository;
  let updateSystem;

  beforeAll(async () => {
    app = await setupTestApp();

    const dataSource = app.get<DataSource>(DataSource);
    systemRepository = dataSource.getRepository(System);
    
    updateSystem = {
      alarm_send_enabled: false,
      equipment_alarm_enabled: true,
      inventory_alarm_enabled: true,
      inventory_long_alarm_enabled: 30,
      load_warning_ratio_crane: 80,
      load_danger_ratio_crane: 90,
      load_warning_color_crane: '#FFA500',
      load_danger_color_crane: '#FF0000',
      load_warning_ratio_gantry: 80,
      load_danger_ratio_gantry: 90,
      load_warning_color_gantry: '#FFA500',
      load_danger_color_gantry: '#FF0000',
    };
  });

  afterAll(async () => {
  });

  // 모든 system 조회
  it('/setting/system (GET) - Get All Systems', async () => {
    const response = await request(app.getHttpServer())
    .get('/setting/system')
    .expect(200);

    expect(Object.keys(response.body)).toEqual(expect.arrayContaining(Object.keys(new SystemResponseDto())));
  });

  // system 수정
  it('/setting/system (PUT) - Update a System', async () => {
    const response = await request(app.getHttpServer())
    .put('/setting/system/')
    .send(updateSystem)
    .expect(200);

    expect(response.body).toHaveProperty('isSuccess', true);
  });
});