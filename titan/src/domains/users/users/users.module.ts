import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { Users } from './entities/users.entity';
import { UsersRepository } from './repositories/users.repository';

import { LoginHistory } from '../login-history/entities/login-history.entity';

import { RoleModule } from '../role/role.module';
import { Role } from '../role/entities/role.entity';

import { RefreshTokenModule } from '../../../core/auth/refresh-token/refresh-token.module';
import { RefreshToken } from '../../../core/auth/refresh-token/entities/refresh-token.entity';

import { MailService } from 'src/core/mail/mail.service';
import { Pagination } from 'src/utils/pagination.util';
import { Cursor } from 'src/utils/cursor.util';

import { AlarmUserRelationModule } from '../../alarm/alarm-user-relation/alarm-user-relation.module';

import { LoginHistoryModule } from '../login-history/login-history.module';


@Module({
  imports: [TypeOrmModule.forFeature([Users, LoginHistory, Role, RefreshToken]),
            RefreshTokenModule,
            AlarmUserRelationModule,
            LoginHistoryModule,
          ],
  controllers: [UsersController],
  providers: [
    UsersService, 
    UsersRepository,
    MailService,
    Pagination,
    Cursor,
  ],
  exports: [UsersService]
})
export class UsersModule {}