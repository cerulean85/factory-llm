import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { RoleRepository } from './respositories/role.repository';
import { Users } from '../users/entities/users.entity';
import { RoleService } from './role.service';
import { UsersRoleController } from './users.role.controller';
import { UsersModule } from '../users/users.module';
import { Pagination } from 'src/utils/pagination.util';

@Module({
  imports: [
    TypeOrmModule.forFeature([Role, Users]),
    UsersModule
],
  controllers: [UsersRoleController],
  providers: [RoleService, RoleRepository, Pagination],
  exports: [RoleService]
})
export class RoleModule {}