import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../users/entities/users.entity';
import { UsersModule } from '../users/users.module';
import { LoginHistory } from './entities/login-history.entity';
import { LoginHistoryRepository } from './respositories/login-history.repository';
import { LoginHistoryService } from './login-history.service';
import { LoginHistoryController } from './login-history.controller';
import { UsersLoginHistoryController } from './users.login-history.controller';
import { Pagination } from 'src/utils/pagination.util';

@Module({
  imports: [
    TypeOrmModule.forFeature([LoginHistory, Users]),
    forwardRef(() => UsersModule)
],
  controllers: [LoginHistoryController, UsersLoginHistoryController],
  providers: [LoginHistoryService, LoginHistoryRepository, Pagination],
  exports: [LoginHistoryService]
})
export class LoginHistoryModule {}
