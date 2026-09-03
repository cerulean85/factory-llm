import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../../users/users/users.module';
import { Users } from '../../users/users/entities/users.entity';
import { Remote } from './entities/remote.entity';
import { RemoteRepository } from './respositories/remote.repository';
import { RemoteService } from './remote.service';
import { RemoteController } from './remote.controller';
import { Pagination } from 'src/utils/pagination.util';

@Module({
  imports: [
    TypeOrmModule.forFeature([Remote, Users]),
    UsersModule
],
  controllers: [RemoteController],
  providers: [RemoteService, RemoteRepository, Pagination],
  exports: [RemoteService]
})
export class RemoteModule {}