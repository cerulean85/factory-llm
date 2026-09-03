import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AlarmUserRelation } from './entities/alarm-user-relation.entity';
import { AlarmUserRelationRepository } from './repositories/alarm-user-relation.repository';
import { AlarmUserRelationService } from './alarm-user-relation.service';
import { Pagination } from 'src/utils/pagination.util';
import { UsersModule } from 'src/domains/users/users/users.module';
import { AlarmModule } from '../alarm/alarm.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([AlarmUserRelation]),
    forwardRef(() => UsersModule),
    forwardRef(() => AlarmModule)
],
  controllers: [],
  providers: [AlarmUserRelationService, AlarmUserRelationRepository, Pagination],
  exports: [AlarmUserRelationService]
})
export class AlarmUserRelationModule {}