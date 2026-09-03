import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Alarm } from './entities/alarm.entity';
import { AlarmRepository } from './repositories/alarm.repository';
import { AlarmService } from './alarm.service';
import { AlarmController } from './alarm.controller';
import { SseModule } from 'src/core/sse/sse.module';
import { Pagination } from 'src/utils/pagination.util';
import { AlarmUserRelationModule } from '../alarm-user-relation/alarm-user-relation.module';
import { FileModule } from '../../../core/file/file.module';

import { UsersRepository } from '../../users/users/repositories/users.repository';
import { MailModule } from 'src/core/mail/mail.module';
import { RefreshTokenModule } from '../../../core/auth/refresh-token/refresh-token.module';
import { Users } from '../../users/users/entities/users.entity';
import { Cursor } from 'src/utils/cursor.util';
import { EquipmentTypeModule } from '../../equipment/equipment-type/equipment-type.module';
import { UsersModule } from '../../users/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Alarm, Users]),
    SseModule,
    EquipmentTypeModule,
    forwardRef(() => AlarmUserRelationModule),
    FileModule,
    MailModule,
    RefreshTokenModule,
    forwardRef(() => UsersModule),
],
  controllers: [AlarmController],
  providers: [AlarmService, AlarmRepository, Pagination, UsersRepository, Cursor],
  exports: [AlarmService, AlarmRepository]
})
export class AlarmModule {}