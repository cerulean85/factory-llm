import { MaxFileSizeValidator, Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from '../users/users/users.module';
import { Pagination } from 'src/utils/pagination.util';
import { Todo } from './entities/todo.entity';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';
import { TodoRepository } from './repositories/todo.repository';
import { SseModule } from 'src/core/sse/sse.module';
import { MailModule } from 'src/core/mail/mail.module';
import { JobHistoryModule } from '../storage/job-history/job-history.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Todo]),
    UsersModule,
    SseModule,
    MailModule,
    JobHistoryModule,
],
  controllers: [TodoController],
  providers: [TodoService, TodoRepository, Pagination, MaxFileSizeValidator],
  exports: [TodoService]
})
export class TodoModule {}