import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { Remote } from 'src/domains/setting/remote/entities/remote.entity';
import { DataSource } from 'typeorm';
import { setupTestApp } from './setup-e2e';

describe('Remote API (e2e)', () => {
  let app: INestApplication;
  let remoteRepository;
  let newCreateRemote;

  beforeAll(async () => {
    app = await setupTestApp();

    const dataSource = app.get<DataSource>(DataSource);
    remoteRepository = dataSource.getRepository(Remote);
    
    newCreateRemote = {location: 'test_insert', ip: '000.000.000.000', port: 1234, seq_id: 1 };
    
  
    //테스트 데이터가 지워지지 않고 있을 경우, clear한 후 시작
    const delData = await remoteRepository.findOne({where: {location: 'test_insert'}});
    if(delData){
      await remoteRepository.delete({ id: delData.id });
    }
  });

  afterAll(async () => {
    //생성된 테스트 데이터 삭제
    if (newCreateRemote) {
      await remoteRepository.delete({ location: 'test_insert' });
    }
  });

  // 모든 remote list 조회
  it('/setting/remote (GET) - Get All Remote Lists', async () => {
    await request(app.getHttpServer())
    .get('/setting/remote')
    .expect(200);
  });

  // 사용자에 해당하는 remote 조회
  it('/setting/remote/:seqId (GET) - Get an Users Remote Lists', async () => {
    await request(app.getHttpServer())
    .get(`/setting/remote/${newCreateRemote.seq_id}`)
    .expect(200);
  });

  // remote 추가
  it('/setting/remote/:seqId (POST) - Create New Remote List', async () => {
    await request(app.getHttpServer())
    .post(`/setting/remote/${newCreateRemote.seq_id}`)
    .send(newCreateRemote)
    .expect(201);
  });

  // remote 수정
  it('/setting/remote/:seqId/:remoteSeqId (PUT) - Update a Remote', async () => {
    const createdRemote = await remoteRepository.findOne({ where : {location: 'test_insert'}});
    await request(app.getHttpServer())
    .put(`/setting/remote/${createdRemote.seq_id}/${createdRemote.id}`)
    .send({port: 5463})
    .expect(200);
  });
 
  // remote 삭제
  it('/setting/remote/:seqId/:remoteSeqId (DELETE) - Delete a Remote', async () => {
    const createdRemote = await remoteRepository.findOne({ where : {location: 'test_insert'}});
    await request(app.getHttpServer())
    .delete(`/setting/remote/${createdRemote.seq_id}/${createdRemote.id}`)
    .expect(200);
  });
});