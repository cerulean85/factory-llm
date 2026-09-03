import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Noti } from '../entities/noti.entity';
import { CreateNotiDto } from '../dto/request/create-noti.dto';
import { UpdateNotiDto } from '../dto/request/update-noti.dto';
import { Users } from 'src/domains/users/users/entities/users.entity';
import { Pagination } from 'src/utils/pagination.util';
import { NotiBaseRepository } from './noti.base.repository';

@Injectable()
export class NotiRepository extends NotiBaseRepository {
  constructor(
    @InjectRepository(Noti)
    repository: Repository<Noti>,
    pagination: Pagination,
  ) {super(repository, pagination);}


  async createNoti(users?: Users, createNotiDto?: CreateNotiDto): Promise<Noti> {
    const newNoti = this.repository.create({
      users: users,
      ...createNotiDto});
    return await this.repository.save(newNoti);
  }

  async updateNoti(noti: Noti, users?: Users, updateNotiDto?: UpdateNotiDto): Promise<boolean> {
    this.repository.merge(noti, {
      users: users,
      update_date: new Date(),
      ...updateNotiDto
    });
    const result = await this.repository.save(noti);
    
    return result ? true : false;
  }

  async softDeleteNotiById(notiId: number): Promise<boolean> {
    const result = await this.repository.update(
      { id: notiId },
      { valid_record: false}
    );
    return result.affected !== undefined && result.affected > 0;
  }
}