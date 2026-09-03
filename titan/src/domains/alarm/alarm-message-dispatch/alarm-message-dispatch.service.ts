import { Injectable, Logger } from '@nestjs/common';
import { SmsService } from 'src/core/sms/sms.service';
import { CreateAlarmSmsDto } from './dto/create-alarm-sms.dto';
import { MessageDispatchHistoryService } from '../history/message-dispatch-history/message-dispatch-history.service';
import { CreateMessageDispatchHistoryDto } from '../history/message-dispatch-history/dto/request/create-message-dispatch-history.dto';
import { SEND_MESSAGE_TYPE } from 'src/common/enum/alarm.enum';
import { DEBUG_SMS } from 'src/config/debug.config';


@Injectable()
export class AlarmMessageDispatchService {
  private readonly logger = new Logger(AlarmMessageDispatchService.name)

  constructor(
    private smsService : SmsService,
    private msgDispHistService : MessageDispatchHistoryService
  ) {}

  async createAlarmSms(createDto: CreateAlarmSmsDto): Promise<boolean> {
    try {

      let isSuccess = false;
      if(DEBUG_SMS){
        const result = await this.smsService.sendSms(
          createDto.phone_number,
          createDto.message,
        );
        isSuccess = !!result?.sid;
      } else {
        isSuccess = true;
      }

      if(isSuccess === false)
        this.logger.warn(`Failed to send message for alarm ID ${createDto.alarm_history_id} to ${createDto.phone_number}. Message: "${createDto.message}"`);
      
      const createHistoryDto = new CreateMessageDispatchHistoryDto();
      createHistoryDto.alarm_history_id = createDto.alarm_history_id;
      createHistoryDto.dispatch_success = isSuccess;
      createHistoryDto.message = createDto.message;
      createHistoryDto.type = SEND_MESSAGE_TYPE.SMS;
      createHistoryDto.users_seq_id = createDto.users_seq_id;
      await this.msgDispHistService.createMessageDispatchHistory(createHistoryDto);

      return isSuccess;
    } catch (error) {
      this.logger.error('SMS 전송 실패:', error);
      return false;
    }
  }
}