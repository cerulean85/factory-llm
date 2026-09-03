import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoginHistory } from '../entities/login-history.entity';
import { CreateLoginHistoryDto } from '../dto/request/create-login-history.dto';
import { Users } from '../../users/entities/users.entity';
import { Pagination } from 'src/utils/pagination.util';
import { LoginHistoryBaseRepository } from './login-history.base.repository';

@Injectable()
export class LoginHistoryRepository extends LoginHistoryBaseRepository {
  constructor(
    @InjectRepository(LoginHistory)
    repository: Repository<LoginHistory>,
    pagination : Pagination,
  ) {super(repository, pagination);}

  async createLoginHistory(user?: Users, createLoginHistoryDto?: CreateLoginHistoryDto): Promise<LoginHistory> {
    const newLoginHistory = this.repository.create({
      users: user,
      ...createLoginHistoryDto
    });
    return await this.repository.save(newLoginHistory);
  }
}