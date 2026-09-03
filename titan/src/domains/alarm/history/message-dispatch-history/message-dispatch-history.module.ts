import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from '../../../users/users/users.module';
import { Pagination } from 'src/utils/pagination.util';
import { MessageDispatchHistory } from './entities/message-dispatch-history.entity';
import { MessageDispatchHistoryController } from './message-dispatch-history.controller';
import { MessageDispatchHistoryService } from './message-dispatch-history.service';
import { MessageDispatchHistoryRepository } from './repositories/message-dispatch-history.repository';
import { AlarmHistoryModule } from '../alarm-history/alarm-history.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([MessageDispatchHistory]),
    UsersModule,
    AlarmHistoryModule
],
  controllers: [MessageDispatchHistoryController],
  providers: [MessageDispatchHistoryService, MessageDispatchHistoryRepository, Pagination],
  exports: [MessageDispatchHistoryService]
})
export class MessageDispatchHistoryModule {}