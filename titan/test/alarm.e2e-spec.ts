import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { setupTestApp } from './setup-e2e';
import { Alarm } from 'src/domains/alarm/alarm/entities/alarm.entity';
import { AlarmResponseDto } from 'src/domains/alarm/alarm/dto/response/alarm-response.dto';
import { DataSource } from 'typeorm';
import { PaginationResponseDto } from 'src/common/dto/pagination-response.dto';
import { CreateAlarmDto } from 'src/domains/alarm/alarm/dto/request/create-alarm.dto';
import { plainToInstance } from 'class-transformer';
import { AlarmUserRelation } from 'src/domains/alarm-user-relation/entities/alarm-user-relation.entity';
import { FILE_PATH } from 'src/config/config.config';
import { FileDto } from 'src/core/file/entities/file.entity';
import * as fs from 'fs';
  
describe('Alarm API (e2e)', () => {
  let app: INestApplication;
  let generatedDbData;
  let existedDbData;
  let alarmRepository;
  let alarmUserRelationRepository;
  let fileRepository;
  let deleteFilePath;
  
  // 새 데이터
  const sampleData = {
    code : 'test code',
    type : 'test type',
    description : 'test description',
    importance : 1,
    processMethod : 'test process method',
    sendEnabled : true,
    equipmentId : 1,
    userSeqIdList: [1, 2],
  }

  const sampleUser = {
    seqId : 1,
    id : "chopyeongsik",
    email: "pyeongsik.cho@hanwha.com",
    name : "조평식",
    phoneNumber : "010-1562-9782"
  }

  const sampleFile = {
    name : "test_file.jpg",
    path: FILE_PATH + "/test/test_file.jpg",
  }
  
  beforeAll(async () => {
    app = await setupTestApp();
  
    const dataSource = app.get<DataSource>(DataSource);

    alarmRepository = dataSource.getRepository(Alarm);
    alarmUserRelationRepository = dataSource.getRepository(AlarmUserRelation);
    fileRepository = dataSource.getRepository(FileDto);
    
    // 테스트 데이터가 지워지지 않고 있을 경우, clear한 후 시작
    const delData = await alarmRepository.findOne({where: {code: 'test code 123'}});
    if(delData){
      await alarmRepository.delete({id: delData.id});
    }
  
    // 테스트 시작 전 테스트 매뉴얼 파일 삭제
    const existedFile = await fileRepository.findOne({where: {name: sampleFile.name}});
    if (existedFile) {
      await fileRepository.delete({id: existedFile.id});
    }

    // 테스트 시작 전, 데이터들 찾기
    existedDbData = await alarmRepository.findOne({ where: { valid_record: true }}); 
    if (!existedDbData) throw new Error('No datas found in the database!');
  });
  
  afterAll(async () => {
    // 생성된 테스트 데이터 삭제
    if (generatedDbData) {
      await alarmRepository.delete({ id: generatedDbData.alarmId });
    }
    if (fs.existsSync(deleteFilePath)) {
      fs.unlinkSync(deleteFilePath);
    }
    if (fs.existsSync('alarmCodeList.csv')) {
      fs.unlinkSync('alarmCodeList.csv');
    }
  });
  
  /*추가해야 할 것
  - alarm/upload-alarm-csv (...)
  */

  // 알람 데이터 생성
  it('/alarm (POST) - Create a New Alarm', async () => {
    const transformedData = plainToInstance(CreateAlarmDto, sampleData, { enableImplicitConversion: true });

    const response = await request(app.getHttpServer())
    .post('/alarm')
    .send(transformedData)
    .expect(201);

    expect(Object.keys(response.body)).toEqual(expect.objectContaining(Object.keys(new AlarmResponseDto())));
    generatedDbData = await alarmRepository.findOne({where: {id : response.body.alarmId}});

    // 릴레이션 데이터 확인
    const generatedRelationDbData = await alarmUserRelationRepository.findOne({where: {alarm: {id: generatedDbData.id}}, relations: ['alarm']});
    expect(generatedRelationDbData.alarm.id).toBe(generatedDbData.id);
  });


  // 모든 데이터 조회
  it('/alarm/get-alarm-code-list (POST) - 모든 알람 데이터 조회', async () => {
    const response = await request(app.getHttpServer())
    .post('/alarm/get-alarm-code-list')
    .send({ page: 1, limit: 10 })
    .expect(201);
    
    expect(Object.keys(response.body)).toEqual(expect.objectContaining(Object.keys(new PaginationResponseDto<Alarm>([],0,10,1))));
    expect(Object.keys(response.body.data[0])).toEqual(expect.arrayContaining(Object.keys(new AlarmResponseDto())));
  });
  

  // 필터링 데이터 조회
  it('/alarm/get-alarm-code-list (POST) - 필터링된 알람 데이터 조회', async () => {
    const response = await request(app.getHttpServer())
    .post('/alarm/get-alarm-code-list')
    .send({ page: 1, limit: 10, equipmentTypeId: 1, importance: 3})
    .expect(201);

    expect(Object.keys(response.body)).toEqual(expect.objectContaining(Object.keys(new PaginationResponseDto<Alarm>([],0,10,1))));
    expect(Object.keys(response.body.data[0])).toEqual(expect.arrayContaining(Object.keys(new AlarmResponseDto())));

    // 관계 데이터 확인
    expect(response.body.data[0].userList.length).toBeGreaterThan(0);  //길이가 1이상인지 확인
  });


  // 특정 데이터 조회
  it('/alarm/:alarmId (GET) - Get Alarm by AlarmID', async () => {
    const response = await request(app.getHttpServer())
    .get(`/alarm/${existedDbData.id}`)
    .expect(200);

    expect(Object.keys(response.body)).toEqual(expect.objectContaining(Object.keys(new AlarmResponseDto()))); 
    expect(response.body.alarmId).toBe(existedDbData.id);

    // 관계 데이터 확인
    expect(response.body.userList.length).toBeGreaterThan(0);  //길이가 1이상인지 확인
  });


  // 특정 알람의 담당자 조회
  it('/alarm/:alarmId/users (GET) - Get users list by AlarmID', async () => {
    const response = await request(app.getHttpServer())
    .get(`/alarm/${generatedDbData.id}`)
    .expect(200);

    expect(Object.keys(response.body)).toEqual(expect.objectContaining(Object.keys(new AlarmResponseDto()))); 
    expect(response.body.alarmId).toBe(generatedDbData.id);

    // 관계 데이터 확인
    expect(response.body.userList.length).toBeGreaterThan(0);  //길이가 1이상인지 확인
  });


  // 알람 CSV 다운로드
  it('/alarm/download-alarm-csv (POST) - Download Alarm CSV', async () => {
    const response = await request(app.getHttpServer())
    .post('/alarm/download-alarm-csv')
    .send({ alarmIdList: String(existedDbData.id) })
    .expect(201);

    expect(response.header['content-type']).toBe('text/csv; charset=utf-8');
    expect(response.header['content-disposition']).toContain('attachment; filename=alarmCodeList.csv');
  });
  

  // 데이터 업데이트
  it('/alarm/:alarmId (PUT) - Update a Alarm', async () => {
    const updGeneratedData = { ...sampleData, code: 'test code 123' };
    const transformedData = plainToInstance(CreateAlarmDto, updGeneratedData, { enableImplicitConversion: true });

    const response = await request(app.getHttpServer())
    .put(`/alarm/${generatedDbData.id}`)
    .send(transformedData)
    .expect(200);
    
    expect(response.body).toHaveProperty('isSuccess', true);

    const findedData = await alarmRepository.findOne({where: {code: 'test code 123'}});
    expect(findedData.code).toBe('test code 123');
  });
    

  // 담당자 추가
  it('/alarm/:alarmId/users (PATCH) - Add User to Alarm', async () => {
    const response = await request(app.getHttpServer())
    .patch(`/alarm/${generatedDbData.id}/users`)
    .send(sampleUser)
    .expect(200);
  
    expect(response.body).toHaveProperty('isSuccess', true);

    // 관계 데이터 확인
    const findedData = await alarmUserRelationRepository.findOne({where: {alarm: {id: generatedDbData.id}, users: {seq_id : sampleUser.seqId }}, relations: ['alarm']});
    expect(findedData.alarm.id).toBe(generatedDbData.id);
  });


  // 담당자 삭제
  it('/alarm/:alarmId/users (DELETE) - Delete User from Alarm', async () => {
    const response = await request(app.getHttpServer())
    .delete(`/alarm/${generatedDbData.id}/users`)
    .send({seqId: sampleUser.seqId})
    .expect(200);

    expect(response.body).toHaveProperty('isSuccess', true);
  });


  // 매뉴얼 파일 업로드
  it('/alarm/:alarmId/manual (Patch) - Add Manual to Alarm', async () => {
    const response = await request(app.getHttpServer())
    .patch(`/alarm/${generatedDbData.id}/manual`)
    .attach('file', sampleFile.path)
    .expect(200);

    expect(Array.isArray(response.body)).toBe(true);

    // 관계 데이터 확인
    const findedData = await fileRepository.findOne({where: {name: sampleFile.name}});
    expect(findedData.name).toBe(sampleFile.name);
  });


  // 매뉴얼 다운로드
  it('/alarm/:alarmId/manual/:fileId (GET) - Download Manual', async () => {
    const file = await fileRepository.findOne({where: {name: sampleFile.name}});
    deleteFilePath = file.path;
    if (!file) throw new Error('No datas found in the database!');

    const response = await request(app.getHttpServer())
    .get(`/alarm/${generatedDbData.id}/manual/${file.id}`)
    .expect(200);
  });


  // 매뉴얼 파일 삭제
  it('/alarm/:alarmId/manual/:fileId (DELETE) - Delete Manual', async () => {
    generatedDbData = await alarmRepository.findOne({where: {id : generatedDbData.id}});
    const file = generatedDbData.file_id_list[0];
    if (!file) throw new Error('No datas found in the database!');

    const response = await request(app.getHttpServer())
    .delete(`/alarm/${generatedDbData.id}/manual/${file}`)
    .expect(200);

    expect(response.body).toHaveProperty('isSuccess', true);

    // 관계 데이터 확인
    const findedData = await fileRepository.findOne({where: {name: sampleFile.name}});
    expect(findedData).toBe(null);
  });


  // 알람 삭제 (비활성화)
  it('/alarm/soft (DELETE) - Delete a Alarm', async () => {
    const response = await request(app.getHttpServer())
    .delete(`/alarm/soft`).send(String(generatedDbData.id))
    .expect(200);
      
    expect(response.body).toHaveProperty('isSuccess', true);

    const findedData = await alarmRepository.findOne({where: {id: generatedDbData.id}});
    expect(findedData.valid_record).toBe(false);

    // 릴레이션 데이터 삭제 확인
    const generatedRelationDbData = await alarmUserRelationRepository.findOne({where: {alarm: {id: generatedDbData.id}}, relations: ['alarm']});
    expect(generatedRelationDbData).toBe(null);
  });
});