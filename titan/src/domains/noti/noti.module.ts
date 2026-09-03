import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Noti } from './entities/noti.entity';
import { NotiRepository } from './repositories/noti.repository';
import { NotiService } from './noti.service';
import { NotiController } from './noti.controller';
import { UsersModule } from '../users/users/users.module';
import { Pagination } from 'src/utils/pagination.util';
import { SseModule } from 'src/core/sse/sse.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Noti]),
    UsersModule,
    SseModule
],
  controllers: [NotiController],
  providers: [NotiService, NotiRepository, Pagination],
  exports: [NotiService]
})
export class NotiModule {}