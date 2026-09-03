import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { setupTestApp } from './setup-e2e';

import { MailRequestDto  } from 'src/core/mail/dto/mail-request.dto';

describe('Mail API (e2e)', () => {
  let app: INestApplication;

  // beforeAll(async () => {
  //   const moduleFixture: TestingModule = await Test.createTestingModule({
  //     imports: [AppModule],
  //   }).compile();

  //   app = moduleFixture.createNestApplication();
  //   await app.init();
  // });
  beforeAll(async () => {
    app = await setupTestApp();
  });


  //모든 유저 찾기
  it('/mail/send (POST) -  send mail', async () => {
    const mailRequestDto  = new MailRequestDto();
    mailRequestDto.to = 'pyeongsik.cho@hanwha.com';
    mailRequestDto.subject = '(TITAN) TEST 메일 발송';
    mailRequestDto.text = 'JEST를 통한 테스트 메일 발송';
    
    const response = await request(app.getHttpServer()).post('/mail/send').send(mailRequestDto).expect(201);
    expect(response.body).toHaveProperty('isSuccess', true);
  });

});