import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AlarmHistoryProcessByUser } from './entities/alarm-history-process-by-user.entity';
import { AlarmHistoryProcessByUserRepository } from './repositories/alarm-history-process-by-user.repository';
import { AlarmHistoryProcessByUserService } from './alarm-history-process-by-user.service';

import { Pagination } from 'src/utils/pagination.util';
import { UsersModule } from 'src/domains/users/users/users.module';
import { AlarmHistoryModule } from '../alarm-history/alarm-history.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AlarmHistoryProcessByUser]),
    forwardRef(() => UsersModule),
    forwardRef(() => AlarmHistoryModule)
],
  controllers: [],
  providers: [AlarmHistoryProcessByUserService, AlarmHistoryProcessByUserRepository, Pagination],
  exports: [AlarmHistoryProcessByUserService]
})
export class AlarmHistoryProcessByUserModule {}