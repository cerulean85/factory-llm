import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Remote } from '../entities/remote.entity';
import { CreateRemoteDto } from '../dto/request/create-remote.dto';
import { Users } from 'src/domains/users/users/entities/users.entity';
import { UpdateRemoteDto } from '../dto/request/update-remote.dto';
import { RemoteBaseRepository } from './remote.base.repository';
import { Pagination } from 'src/utils/pagination.util';

@Injectable()
export class RemoteRepository extends RemoteBaseRepository {
  constructor(
    @InjectRepository(Remote)
    repository: Repository<Remote>,
    pagination: Pagination,
  ) { super(repository, pagination); }

  async createRemote(users: Users, createRemoteDto: CreateRemoteDto): Promise<Remote> {
    const newRemote = this.repository.create({
      users: users,
      ...createRemoteDto
    });
    return await this.repository.save(newRemote);
  }

  async softDeleteRemoteById(id: number) {
    const result = await this.repository.update(id, {valid_record: false});
    return result.affected !== undefined && result.affected > 0;
  }

  async updateRemote(remote: Remote, users: Users, updateRemoteDto: UpdateRemoteDto): Promise<boolean> {
    this.repository.merge(remote, {
      users: users,
      update_date: new Date(),
      ...updateRemoteDto
    });
    const result = await this.repository.save(remote);
    return result ? true : false;
  }
}