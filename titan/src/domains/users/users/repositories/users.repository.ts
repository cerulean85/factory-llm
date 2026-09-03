import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from '../entities/users.entity';
import { CreateUsersDto } from '../dto/request/create-users.dto';
import { UpdateUsersDto } from 'src/domains/users/users/dto/request/update-users.dto';
import { Pagination } from 'src/utils/pagination.util';
import { CursorResponseDto } from 'src/common/dto/cursor-response.dto';
import { Cursor } from 'src/utils/cursor.util';
import { CursorFilteringUsersDto } from '../dto/request/cursor-filtering-user.dto';
import { ORDER } from 'src/common/enum/db.enum';
import { UsersBaseRepository } from './users.base.repository';

@Injectable()
export class UsersRepository extends UsersBaseRepository {
  constructor(
    @InjectRepository(Users)
    repository: Repository<Users>,
    pagination: Pagination,
    private readonly cursor: Cursor,
  ) {super(repository, pagination);}

  async createUsers(createUsersDto: CreateUsersDto): Promise<Users> {
    const newUser = this.repository.create(createUsersDto);
    return await this.repository.save(newUser);
  }

  async updateUsers(seq_id: number, updateUsersDto : UpdateUsersDto): Promise<boolean> {
    const result = await this.repository.update(seq_id, {
      update_date: new Date(),
      ...updateUsersDto
    });
    return result.affected !== undefined && result.affected > 0;
  }

  async softDeleteUsersBySeqId(seq_id: number) {
    const result = await this.repository.update(seq_id, {valid_record : false});
    return result.affected !== undefined && result.affected > 0;
  }

  async getFilteredCursorList(
    filter: CursorFilteringUsersDto = new CursorFilteringUsersDto(),
    orderById: ORDER = ORDER.DEFAULT
  ): Promise<CursorResponseDto<Users>> {
    const queryBuilder = this.createJoinQueryBuilder();

    if (filter.keyword) {
      queryBuilder.andWhere(
        '(users.name LIKE :keyword OR users.phone_number LIKE :keyword OR users.email LIKE :keyword)', { keyword: `%${filter.keyword}%` });
    }
    if (orderById === ORDER.ASC) {
      queryBuilder.orderBy('users.seq_id', 'ASC');
    } else if (orderById === ORDER.DESC) {
      queryBuilder.orderBy('users.seq_id', 'DESC');
    }
    const result = await this.cursor.CursorWithQueryBuilder(queryBuilder, filter);
    return result;
  }

  async blockUserBySeqId(seq_id: number, blocking: boolean) {
    const result = await this.repository.update(seq_id, { blocking });
    return result.affected !== undefined && result.affected > 0;
  }

  async existByUserId(user_id: string): Promise<boolean>{
    return await this.repository.existsBy({ user_id });
  }
}