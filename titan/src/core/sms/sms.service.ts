import { Injectable } from '@nestjs/common';
import * as Twilio from 'twilio';
import { SMS_CONFIG } from 'src/config/sms.config';


@Injectable()
export class SmsService {
  private client: Twilio.Twilio;

  constructor() {
    this.client = Twilio(
      SMS_CONFIG.ACCOUNT_SID,
      SMS_CONFIG.AUTH_TOKEN,
    );
  }

  // ### 중요! ###
  // Twilio API를 사용하기 위한 설정
  // Secure 망에서는 동작하지 않음
  // to에는 국가 코드까지 붙여야함.  (ex. +821012341234)
  async sendSms(to: string, body: string): Promise<any> {
    const transformTo = this.transformPhoneNumber(to);
    const result = await this.client.messages.create({
      body,
      from: SMS_CONFIG.PHONE_NUMBER, // 송신 번호
      to : transformTo,                                     // 수신자 번호 (+82...)
    });

    return result;
  }

  // 전화번호에서 '-'를 제거하고, '+'를 붙여서 반환
  // ex) 010-1234-5678 -> +821012345678
  private transformPhoneNumber(phoneNumber: string): string {
    return phoneNumber.replace(/-/g, '').replace(/^(0)/, '+82');
  }
}