import { Injectable } from '@nestjs/common';
import { RefreshToken } from '../entities/refresh-token.entity';
import { Users } from 'src/domains/users/users/entities/users.entity';
import { CreateRefreshTokenDto } from '../dto/create-refresh-token.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RefreshTokenBaseRepository } from './refresh-token.base.repository';
import { Pagination } from 'src/utils/pagination.util';

@Injectable()
export class RefreshTokenRepository extends RefreshTokenBaseRepository {
  constructor(
    @InjectRepository(RefreshToken)
    repository: Repository<RefreshToken>,
    pagination: Pagination
  ) {super(repository, pagination);}
  
  async createRefreshToken(users: Users, createRefreshTokenDto: CreateRefreshTokenDto): Promise<RefreshToken> {
    const result = this.repository.create({
      users: users,
      ...createRefreshTokenDto
    });
    return await this.repository.save(result);
  }

  async deleteRefreshToken(refresh_token:string): Promise<boolean> {
    const result = await this.repository.delete({refresh_token});
    return result ? true : false;
  }
}