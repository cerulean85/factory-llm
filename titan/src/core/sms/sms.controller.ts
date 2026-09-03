import { Controller, Post, Body } from '@nestjs/common';
import { SmsService } from './sms.service';

// 테스트 컨트롤러 - 빌드 시, 삭제해야합니다 
@Controller('sms')
export class SmsController {
  constructor(private readonly smsService: SmsService) {}

  
  // @Post('send')
  // async sendSms(@Body() body: { to: string; message: string }) {
  //   return await this.smsService.sendSms(body.to, body.message);
  // }
}