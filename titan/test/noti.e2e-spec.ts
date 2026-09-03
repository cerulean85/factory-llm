import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { setupTestApp } from './setup-e2e';
import { Noti } from 'src/domains/noti/entities/noti.entity';
import { NotiResponseDto } from 'src/domains/noti/dto/response/noti-response.dto';
import { DataSource } from 'typeorm';
import { PaginationResponseDto } from 'src/common/dto/pagination-response.dto';

describe('Noti API (e2e)', () => {
  let app: INestApplication;
  let newNoti;
  let existedNoti;
  let editedNoti;
  let notiRepository;

  // 새 데이터
  const generatedTitle = 'test title';
  const generatedContent = 'test content';

  //업데이트 데이터
  const editedContent = 'edited test content';

  beforeAll(async () => {
    app = await setupTestApp();

    const dataSource = app.get<DataSource>(DataSource);
    newNoti = { title: generatedTitle, content: generatedContent, usersSeqId: 1 };
    editedNoti = { content: editedContent };
    notiRepository = dataSource.getRepository(Noti);
  
    //테스트 데이터가 지워지지 않고 있을 경우, clear한 후 시작
    const delNoti = await notiRepository.findOne({where: {title: 'test title'}});
    if(delNoti){
      await notiRepository.delete({id: delNoti.id});
    }

    //테스트 시작 전, 공지들 찾기
    existedNoti = await notiRepository.findOne({ where: { valid_record: true }});
    if (!existedNoti) throw new Error('No noties found in the database!');
  });

  afterAll(async () => {
    //생성된 테스트 데이터 삭제
    if (newNoti) {
      await notiRepository.delete({ id: newNoti.id });
    }
  });

  //모든 공지 조회
  it('/noti (GET) - Get All Noties', async () => {
    const response = await request(app.getHttpServer())
    .get('/noti')
    .query({ page: 1, limit: 10 })
    .expect(200);

    expect(Array.isArray(response.body.data)).toBe(true);
    expect(Object.keys(response.body)).toEqual(expect.objectContaining(Object.keys(new PaginationResponseDto<Noti>([],0,10,1))));
    expect(Object.keys(response.body.data[0])).toEqual(expect.arrayContaining(Object.keys(new NotiResponseDto())));
  });


  //특정 공지 조회
  it('/noti/:notiId (GET) - Get Noti by NotiID', async () => {
    const response = await request(app.getHttpServer())
    .get(`/noti/${existedNoti.id}`)
    .expect(200);

    expect(Object.keys(response.body)).toEqual(expect.objectContaining(Object.keys(new NotiResponseDto()))); 
  });

  // 최근 공지 조회
  it('/noti/get-recently-noti-list (GET) - Get Recently Noties', async () => {
    const response = await request(app.getHttpServer())
    .get('/noti/get-recently-noti-list')
    .expect(200);

    expect(Object.keys(response.body['week'][0])).toEqual(expect.objectContaining(Object.keys(new NotiResponseDto())));
  });


  //공지 생성
  it('/noti (POST) - Create a New Noti', async () => {
    const response = await request(app.getHttpServer())
    .post('/noti')
    .send(newNoti)
    .expect(201);
    
    expect(Object.keys(response.body)).toEqual(expect.objectContaining(Object.keys(new NotiResponseDto())));
    newNoti = await notiRepository.findOne({where: { id : response.body.notiId }});
  });


  //공지 업데이트
  it('/noti/:notiId (PUT) - Update a Noti', async () => {
    const response = await request(app.getHttpServer())
    .put(`/noti/${newNoti.id}`)
    .send(editedNoti)
    .expect(200);
    
    expect(response.body).toHaveProperty('isSuccess', true);
  });
  

  //공지 삭제 (비활성화)
  it('/noti/:notiId (DELETE) - Delete a Noti', async () => {
    const response = await request(app.getHttpServer())
    .delete(`/noti/${newNoti.id}/soft`)
    .expect(200);
    
    expect(response.body).toHaveProperty('isSuccess', true);
  });
});