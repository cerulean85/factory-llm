import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AlarmMessageDispatchService as AlarmMessageDispatchService } from './alarm-message-dispatch.service';
import { JwtServiceAuthGuard } from 'src/core/auth/jwt/jwt-service.guard';
import { ApiBody } from '@nestjs/swagger';
import { CreateAlarmSmsDto } from './dto/create-alarm-sms.dto';
import { ApiReturn } from 'src/common/decorator/api-return.decorator';
import { ResponseStatusDto } from 'src/common/dto/response-status.dto';

@Controller('alarm-message-dispatch')
export class AlarmMessageDispatchController {
  constructor(private readonly dispatchService: AlarmMessageDispatchService) {}

  @Post('send-sms')
  @UseGuards(JwtServiceAuthGuard)
  @ApiBody({ type : CreateAlarmSmsDto })
  @ApiReturn(ResponseStatusDto, "메시지 전송", "성공 여부", "메세지 전송 성공 여부" )
  async createAlarmSms(
    @Body() createDto: CreateAlarmSmsDto,
  ) {
    const res = new ResponseStatusDto();
    res.isSuccess = await this.dispatchService.createAlarmSms(createDto);
    return res;
  };

}