import { Module } from '@nestjs/common';
import { AlarmMessageDispatchService } from './alarm-message-dispatch.service';
import { AlarmMessageDispatchController } from './alarm-message-dispatch.controller';
import { SmsModule } from 'src/core/sms/sms.module';
import { MessageDispatchHistoryModule } from '../history/message-dispatch-history/message-dispatch-history.module';
@Module({
  imports: [
    SmsModule,
    MessageDispatchHistoryModule,
  ],
  controllers: [AlarmMessageDispatchController],
  providers: [AlarmMessageDispatchService],
  exports: [AlarmMessageDispatchService],
})
export class AlarmMessageDispatchModule {}