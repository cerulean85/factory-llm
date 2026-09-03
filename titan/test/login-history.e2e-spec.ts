import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { LoginHistory } from 'src/domains/users/login-history/entities/login-history.entity';
import { DataSource } from 'typeorm';
import { setupTestApp } from './setup-e2e';
import { PaginationResponseDto } from 'src/common/dto/pagination-response.dto';
import { LoginHistoryResponseDto } from 'src/domains/users/login-history/dto/response/login-history-response.dto';

describe('Login-history API (e2e)', () => {
  let app: INestApplication;
  let loginHistoryRepository;
  let newCreateloginHistory;
  let userSeqId;

  beforeAll(async () => {
    app = await setupTestApp();

    const dataSource = app.get<DataSource>(DataSource);
    loginHistoryRepository = dataSource.getRepository(LoginHistory);
    newCreateloginHistory = { try_ip: "000.000.000.000" };
    userSeqId = 1;
  });

  afterAll(async () => {
    //생성된 테스트 데이터 삭제
    if (newCreateloginHistory) {
      await loginHistoryRepository.delete({ try_ip : "000.000.000.000" });
    }

  });

  // 모든 login history 조회
  it('/login-history (GET) - Get All Login Histories', async () => {
    const response = await request(app.getHttpServer())
    .get('/history')
    .query({ page: 1, limit: 10})
    .expect(200);

    expect(Array.isArray(response.body.data)).toBe(true);
    expect(Object.keys(response.body)).toEqual(expect.objectContaining(Object.keys(new PaginationResponseDto<LoginHistory>([],0,10,1))));
    expect(Object.keys(response.body.data[0])).toEqual(expect.arrayContaining(Object.keys(new LoginHistoryResponseDto())));
  });

  // login history 추가
  it('/users/:userSeqId/history (POST) - Create New Login History', async() => {
    const response = await request(app.getHttpServer())
    .post(`/users/${userSeqId}/history`)
    .send(newCreateloginHistory)
    .expect(201);

    expect(Object.keys(response.body)).toEqual(expect.objectContaining(Object.keys(new LoginHistoryResponseDto())));
  })

  // SeqId에 해당하는 login history 조회
  it('/users/:userSeqId/history (GET) - Get login Histories of an User', async () => {
    const response = await request(app.getHttpServer())
    .get(`/users/${userSeqId}/history`)
    .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(Object.keys(response.body[0])).toEqual(expect.arrayContaining(Object.keys(new LoginHistoryResponseDto())));
  });
});