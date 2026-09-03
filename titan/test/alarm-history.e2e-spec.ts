  import { Test, TestingModule } from '@nestjs/testing';
  import { INestApplication } from '@nestjs/common';
  import * as request from 'supertest';
  import { setupTestApp } from './setup-e2e';
  import { DataSource, Like } from 'typeorm';
  import { PaginationResponseDto } from 'src/common/dto/pagination-response.dto';
  import { plainToInstance } from 'class-transformer';
  import { AlarmHistoryProcessByUser } from 'src/domains/alarm-history-process-by-user/entities/alarm-history-process-by-user.entity';
  import { AlarmHistory } from 'src/domains/alarm-history/entities/alarm-history.entity';
  import { CreateAlarmHistoryDto } from 'src/domains/alarm-history/dto/request/create-alarm-history.dto';
  import { AlarmHistoryResponseDto } from 'src/domains/alarm-history/dto/response/alarm-history-response.dto';
  import { ProcessAlarmHistoryDto } from 'src/domains/alarm-history/dto/request/process-alarm-history.dto';
  
  describe('AlarmHistory API (e2e)', () => {
    let app: INestApplication;
    let generatedDbData;
    let existedDbData;
    let alarmHistoryRepository;
    let relationRepository;
  
    // 새 데이터
    const sampleData = {
      alarmId : 1,
      process_datae: null,
      message : 'test message',
      process_message : '',
      userSeqIdList : [1, 2]
    }
  
    beforeAll(async () => {
      app = await setupTestApp();
  
      const dataSource = app.get<DataSource>(DataSource);

      alarmHistoryRepository = dataSource.getRepository(AlarmHistory);
      relationRepository = dataSource.getRepository(AlarmHistoryProcessByUser);
    
      //테스트 데이터가 지워지지 않고 있을 경우, clear한 후 시작
      const delDataList = await alarmHistoryRepository.find({
        where: {
          message: Like('%test message%'), // 'test message'가 포함된 모든 것
        },
      });
      
      if (delDataList.length > 0) {
        const idsToDelete = delDataList.map(item => item.id);
        await alarmHistoryRepository.delete(idsToDelete);
      }
  
      //테스트 시작 전, 데이터들 찾기
      [existedDbData] = await alarmHistoryRepository.find({
        take: 1,
      });
      if (!existedDbData) throw new Error('No datas found in the database!');
    });
  
    afterAll(async () => {
      //생성된 테스트 데이터 삭제
      if (generatedDbData) {
        await alarmHistoryRepository.delete({ id: generatedDbData.id });
      }
    });
  
    //알람 데이터 생성
    it('/alarm-history (POST) - Create a New AlarmHistory', async () => {
      const transformedData = plainToInstance(CreateAlarmHistoryDto, sampleData, { enableImplicitConversion: true });
      const response = await request(app.getHttpServer()).post('/alarm-history').send(transformedData).expect(201);
      expect(Object.keys(response.body)).toEqual(expect.objectContaining(Object.keys(new AlarmHistoryResponseDto())));
      generatedDbData = await alarmHistoryRepository.findOne({where: {id : response.body.alarmHistoryId}});

      // 릴레이션 데이터 확인
      const generatedRelationDbData = await relationRepository.findOne({where: {alarmHistory: {id: generatedDbData.id}}, relations: ['alarmHistory']});
      expect(generatedRelationDbData.alarmHistory.id).toBe(generatedDbData.id);
    });


    //모든 데이터 조회
    it('/alarm-history (GET) - Get All alarm-history', async () => {
      const response = await request(app.getHttpServer())
      .get('/alarm-history')
      .query({ page: 1, limit: 10 })
      .expect(200);
  
      expect(Object.keys(response.body)).toEqual(expect.objectContaining(Object.keys(new PaginationResponseDto<AlarmHistory>([],0,10,1))));
      expect(Object.keys(response.body.data[0])).toEqual(expect.arrayContaining(Object.keys(new AlarmHistoryResponseDto())));
    });
  
    //필터링 데이터 조회
    it('/alarm-history (GET) - Get filtering alarm-history', async () => {
      const response = await request(app.getHttpServer())
      .get('/alarm-history')
      .query({ page: 1, limit: 10, userSeqIdList: [1, 2], alarmId: 1 })
      .expect(200);
  
      expect(Object.keys(response.body)).toEqual(expect.objectContaining(Object.keys(new PaginationResponseDto<AlarmHistory>([],0,10,1))));
      expect(Object.keys(response.body.data[0])).toEqual(expect.arrayContaining(Object.keys(new AlarmHistoryResponseDto())));
      expect(response.body.data[0].message).toBe('test message');
      //관계 데이터 확인
      expect(response.body.data[0].userList.length).toBeGreaterThan(0);  //길이가 1이상인 지 확인
    });

  
    //특정 데이터 조회
    it('/alarm-history/:alarmHistoryId (GET) - Get AlarmHistory by AlarmHistoryID', async () => {
      const response = await request(app.getHttpServer())
      .get(`/alarm-history/${existedDbData.id}`)
      .expect(200);
  
      expect(Object.keys(response.body)).toEqual(expect.objectContaining(Object.keys(new AlarmHistoryResponseDto()))); 
      expect(response.body.alarmHistoryId).toBe(existedDbData.id);

      //관계 데이터 확인
      //expect(response.body.userList.length).toBeGreaterThan(0);  //길이가 1이상인 지 확인
    });
  
    
    //데이터 업데이트
    it('/alarm-history/:alarmHistoryId (PATCH) - Update a AlarmHistory', async () => {
      const updGeneratedData = { ...sampleData, message: 'test message 123' };
      const transformedData = plainToInstance(ProcessAlarmHistoryDto, updGeneratedData, { enableImplicitConversion: true });

      const response = await request(app.getHttpServer())
      .patch(`/alarm-history/${generatedDbData.id}`)
      .send(transformedData)
      .expect(200);
      
      expect(response.body).toHaveProperty('isSuccess', true);

      const findedData = await alarmHistoryRepository.findOne({where: {message: 'test message 123'}});
      expect(findedData.message).toBe('test message 123');
    });
  });