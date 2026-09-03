import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { setupTestApp } from './setup-e2e';
import { Users } from 'src/domains/users/users/entities/users.entity';
import { UsersResponseDto } from 'src/domains/users/users/dto/response/users-response.dto';
import { CreateUsersDto } from 'src/domains/users/users/dto/request/create-users.dto';
import { UsersSeedList } from 'src/seeds/domains/user.seed';
import { DataSource } from 'typeorm';
import { PaginationResponseDto } from 'src/common/dto/pagination-response.dto';

describe('Users API (e2e)', () => {
  let app: INestApplication;
  let existingUsers: Users;
  let createdUsers: Users;
  let userRepository;
  let refreshToken;
  let emailCode;

  // 참고 : plainToInstance 활용 
  // const generateUserDtoFromSeed = (seedUser = UsersSeedList[0]): CreateUsersDto =>
  //   plainToInstance(CreateUsersDto, {
  //     ...seedUser,
  //     user_id: `test_${seedUser.user_id}`,
  //     password: 'Testrd1!@'
  //   }, { excludeExtraneousValues: false });

  // 인서트 데이터 생성
  const generatedUserId = 'test_insert';
  const generatedPassword = 'Testrd1!@';
  const generateCreateUserDtoFromSeed = (seedUser = UsersSeedList[0]): CreateUsersDto => {
    const { seq_id, ...rest } = seedUser;
    return {
      ...rest, 
      user_id: generatedUserId,
      password: generatedPassword
    } as CreateUsersDto;
  };

  // 업데이트 데이터 생성
  const generateUpdateUserDtoFromSeed = (seedUser = UsersSeedList[0]): CreateUsersDto => {
    const { seq_id, ...rest } = seedUser;
    return {
      ...rest, 
      user_id: generatedUserId,
      password: generatedPassword
    } as CreateUsersDto;
  };

  beforeAll(async () => {
    app = await setupTestApp();

    const dataSource = app.get<DataSource>(DataSource);
    userRepository = dataSource.getRepository(Users);
  
    // 테스트 데이터가 지워지지 않고 있을 경우, clear한 후 시작
    const delUser = await userRepository.findOne({where: {user_id: 'test_insert'}});
    if(delUser){
      await userRepository.delete({seq_id: delUser.seq_id});
    }

    // 테스트 시작 전, user 데이터를 찾음
    const user = await userRepository.findOne({ where: { valid_record: true} });
    if (!user) throw new Error('No users found in the database!');
    existingUsers = user;
  });

  afterAll(async () => {
    //생성된 테스트 데이터 삭제
    if (createdUsers) {
      await userRepository.delete({ seq_id: createdUsers.seq_id });
    }
  });


  // 모든 유저 찾기
  it('/users (GET) - Get All Users', async () => {
    const response = await request(app.getHttpServer())
    .get('/users')
    .query({ page: 1, limit: 10 })
    .expect(200);
    
    // expect(Array.isArray(response.body.data)).toBe(true);
    expect(Object.keys(response.body)).toEqual(expect.objectContaining(Object.keys(new PaginationResponseDto<Users>([],0,10,1))));
    expect(Object.keys(response.body['data'][0])).toEqual(expect.arrayContaining(Object.keys(new UsersResponseDto())));
  });


  // 유저 회원정보 조회
  it('/users/:seqId (GET) - Get User by SeqID', async () => {
    const response = await request(app.getHttpServer())
    .get(`/users/${existingUsers.seq_id}`)
    .expect(200);

    expect(Object.keys(response.body)).toEqual(expect.objectContaining(Object.keys(new UsersResponseDto()))); 
  });


  // 회원 가입
  it('/users/signup (POST) - Create a New User', async () => {
    const newTempUser = generateCreateUserDtoFromSeed(); 

    const response = await request(app.getHttpServer())
    .post('/users/signup')
    .send(newTempUser)
    .expect(201);

    expect(Object.keys(response.body)).toEqual(expect.objectContaining(Object.keys(new UsersResponseDto())));
    createdUsers = await userRepository.findOne({where: {user_id : response.body.userId}});
  });


  // 로그인
  it('/users/login (POST) - User Login', async () => {
    const loginPayload = {
      userId: generatedUserId,
      password: generatedPassword,
    };

    const response = await request(app.getHttpServer())
    .post('/users/login')
    .send(loginPayload)
    .expect(201);

    expect(response.body).toHaveProperty('accessToken');
    refreshToken = response.body.refreshToken;
  });


  // 유저 정보 찾기 by Email, PhoneNumber
  it('/users/id (POST) - Find User ID by Email and Phone Number', async () => {
    const requestBody = {
      emailOrPhoneNumber: existingUsers.email};

    const response = await request(app.getHttpServer())
    .post('/users/id')
    .send(requestBody)
    .expect(201);
    
    expect(response.body).toEqual({userId : existingUsers.user_id});
  });


  // 유저 비밀번호 확인
  it('/users/:seqId/validate-password (POST) - Validate User Password', async () => {
    const response = await request(app.getHttpServer())
    .post(`/users/${createdUsers.seq_id}/validate-password`)
    .send({password : generatedPassword})
    .expect(201);

    expect(response.body).toHaveProperty('isSuccess', true);
  });

  
  // 유저 이메일 인증번호 발송
  it('/users/send-code (POST) - Send Email Validate Code', async () => {
    const requestBody = {
      email: createdUsers.email,
    };

    const response = await request(app.getHttpServer())
    .post('/users/send-code')
    .send(requestBody)
    .expect(201);

    expect(response.body).toHaveProperty('code');
    emailCode = response.body.code;
  });


  // 유저 이메일 인증번호 확인
  it('/users/confirm-code (POST) - Confirm Email Validate Code', async () => {
    const requestBody = {
      email: createdUsers.email,
      code: emailCode,
    };

    const response = await request(app.getHttpServer())
    .post('/users/confirm-code')
    .send(requestBody)
    .expect(201);

    expect(response.body).toHaveProperty('isSuccess', true);
  });


  // 유저 정보 업데이트
  it('/users/:seqId/info (PUT) - Update a User', async () => {
    const newTempUser = generateUpdateUserDtoFromSeed();

    const response = await request(app.getHttpServer())
    .patch(`/users/${createdUsers.seq_id}/info`)
    .send(newTempUser)
    .expect(200);

    expect(response.body).toHaveProperty('isSuccess', true);
  });


  // Access Token 재발급
  it('/users/:seqId/refresh (PATCH) - Refresh Access Token', async () => {
    const response = await request(app.getHttpServer())
    .patch(`/users/${createdUsers.seq_id}/refresh`)
    .send({refreshToken})
    .expect(200);

    expect(response.body).toHaveProperty('accessToken');
  });


  // 유저 차단
  it('/users/:seqId/block (PATCH) - Block a User', async () => {
    const response = await request(app.getHttpServer())
    .patch(`/users/${createdUsers.seq_id}/block`)
    .expect(200);

    expect(response.body).toHaveProperty('isSuccess', true);
  });


  // 유저 차단 해제
  it('/users/:seqId/unblock (PATCH) - Unblock a User', async () => {
    const loginPayload = {
      userId: generatedUserId,
      password: generatedPassword,
    };

    const response = await request(app.getHttpServer())
    .patch(`/users/unblock`)
    .send(loginPayload)
    .expect(200);

    expect(response.body).toHaveProperty('isSuccess', true);
  });


  // 유저 임시 비밀번호 발급
  it('/users/temp-password (PATCH) - Issue Temporary Password', async () => {
    const requestBody = {
      userId: createdUsers.user_id,
      email: createdUsers.email,
    };

    const response = await request(app.getHttpServer())
    .patch('/users/temp-password')
    .send(requestBody)
    .expect(200);

    expect(response.body).toHaveProperty('isSuccess', true);
  });


  // 유저 로그아웃
  it('/users/:seqId/logout (POST) - Logout a User', async () => {
    const response = await request(app.getHttpServer()).post(`/users/${createdUsers.seq_id}/logout`)
    .send({refreshToken})
    .expect(201);

    expect(response.body).toHaveProperty('isSuccess', true);
  });


  // 유저 정보 삭제 (비활성화)
  it('/:seqId/soft (DELETE) - Delete a User', async () => {
    const response = await request(app.getHttpServer())
    .delete(`/users/${createdUsers.seq_id}/soft`)
    .expect(200);

    expect(response.body).toHaveProperty('isSuccess', true);
  });
});