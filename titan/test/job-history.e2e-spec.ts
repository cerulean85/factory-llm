import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { JobHistory } from 'src/domains/job-history/entities/job-history.entity';
import { DataSource } from 'typeorm';
import { setupTestApp } from './setup-e2e';
import { PaginationResponseDto } from 'src/common/dto/pagination-response.dto';
import { JobHistoryResponseDto } from 'src/domains/job-history/dto/response/job-history-response.dto';

describe('Job-history API (e2e)', () => {
  let app: INestApplication;
  let jobHistoryRepository;
  let newCreatejobHistory;

  beforeAll(async () => {
    app = await setupTestApp();

    const dataSource = app.get<DataSource>(DataSource);
    jobHistoryRepository = dataSource.getRepository(JobHistory);
    
    newCreatejobHistory = { job: 'test_insert', equipment_id: 1 };
    
  
    //테스트 데이터가 지워지지 않고 있을 경우, clear한 후 시작
    const delData = await jobHistoryRepository.findOne({where: {job: 'test_insert'}});
    if(delData){
      await jobHistoryRepository.delete({ id: delData.id });
    }
  });

  afterAll(async () => {
    //생성된 테스트 데이터 삭제
    if (newCreatejobHistory) {
      await jobHistoryRepository.delete({ job : 'test_insert' });
    }

  });

  // 모든 job history 조회
  it('/job-history (GET) - Get All Job Histories', async () => {
    const response = await request(app.getHttpServer())
    .get('/job-history')
    .query({ page: 1, limit: 10})
    .expect(200);

    expect(Array.isArray(response.body.data)).toBe(true);
    expect(Object.keys(response.body)).toEqual(expect.objectContaining(Object.keys(new PaginationResponseDto<JobHistory>([],0,10,1))));
    expect(Object.keys(response.body.data[0])).toEqual(expect.arrayContaining(Object.keys(new JobHistoryResponseDto())));
  });

  // 장비에 해당하는 job history 조회
  it('/equipment/:equipmentId/history (GET) - Get job Histories of an Equipment', async () => {
    await request(app.getHttpServer())
    .get(`/equipment/${newCreatejobHistory.equipment_id}/history`)
    .expect(200);
  });

  // job history 추가
  it('/equipment/:equipmentId/history (POST) - Create New Job History', async () => {
    await request(app.getHttpServer())
    .post(`/equipment/${newCreatejobHistory.equipment_id}/history`)
    .send(newCreatejobHistory)
    .expect(201);
  });

  // job history 수정
  it('/equipment/:equipmentId/history/:jobHistoryId (PUT) - Update a Job History', async () => {
    const createdjobHistory = await jobHistoryRepository.findOne({ where : {job: 'test_insert'}});
    await request(app.getHttpServer())
    .put(`/equipment/${createdjobHistory.equipment_id}/history/${createdjobHistory.id}`)
    .send({job: 'test_insert'})
    .expect(200);
  });
 
  // remote 삭제
  it('/equipment/:equipmentId/history/:jobHistoryId (DELETE) - Delete a Job History', async () => {
    const createdjobHistory = await jobHistoryRepository.findOne({ where : {job: 'test_insert'}});
    await request(app.getHttpServer())
    .delete(`/equipment/${createdjobHistory.equipment_id}/history/${createdjobHistory.id}`)
    .expect(200);
  });
});