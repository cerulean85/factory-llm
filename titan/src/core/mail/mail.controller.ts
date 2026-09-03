import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailRequestDto } from './dto/mail-request.dto';
import { JwtServiceAuthGuard } from 'src/core/auth/jwt/jwt-service.guard';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('send')
  @UseGuards(JwtServiceAuthGuard)
  async sendEmail(@Body() mailRequestDto : MailRequestDto ) {
    return await this.mailService.sendMail(mailRequestDto);
  }
}