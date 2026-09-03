import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { MailRequestDto } from './dto/mail-request.dto';
import { DEBUG_EMAIL } from 'src/config/debug.config';
import { ResponseStatusDto } from 'src/common/dto/response-status.dto';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name)
  constructor(private readonly mailerService: MailerService) {}
  async sendMail(mailRequestDto : MailRequestDto) : Promise<ResponseStatusDto> {
    let resStatusDto = new ResponseStatusDto();
    try {
      if(DEBUG_EMAIL){
        const mailResult = await this.mailerService.sendMail({
          to: mailRequestDto.to,
          subject: mailRequestDto.subject,
          text: mailRequestDto.text,
          html: `<p>${mailRequestDto.text}</p>`,
        });
        // 전송 송공 리턴값 : {"accepted":["ggbebe7@gmail.com"],"rejected":[],"ehlo":["SIZE 39845888","8BITMIME","PIPELINING","SMTPUTF8","AUTH PLAIN LOGIN","ENHANCEDSTATUSCODES"],"envelopeTime":142,"messageTime":362,"messageSize":595,"response":"250 2.0.0 OK PZ9jti94QYeAzB-7c5VVWg - nsmtp","envelope":{"from":"chopyeongsik@naver.com","to":["ggbebe7@gmail.com"]},"messageId":"<565c6971-1b8f-3a53-f632-78413d295176@naver.com>"}
        this.logger.log(mailResult);
      }
      resStatusDto.isSuccess = true;
      resStatusDto.message = `Email sent to ${mailRequestDto.to}`;
      return resStatusDto;
    } catch (error) {
      resStatusDto.isSuccess = false;
      resStatusDto.message = `Failed to send email: ${error.message}`;
      return resStatusDto;
    }
  }
}