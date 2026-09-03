import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { MAIL_CONFIG } from 'src/config/mail.config';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: MAIL_CONFIG.HOST,
        port: MAIL_CONFIG.PORT,
        secure: MAIL_CONFIG.SECURE,
        auth: {
          user: MAIL_CONFIG.USER,
          pass: MAIL_CONFIG.PASS,
        },
      },
      defaults: {
        from: MAIL_CONFIG.FROM
      },
    }),
  ],
  controllers: [MailController],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}