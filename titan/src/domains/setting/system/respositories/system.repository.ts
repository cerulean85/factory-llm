import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { System } from '../entities/system.entity';
import { CreateSystemDto } from '../dto/request/create-system.dto';
import { UpdateSystemDto } from '../dto/request/update-system.dto';
import { SystemBaseRepository } from './system.base.repository';
import { Pagination } from 'src/utils/pagination.util';

@Injectable()
export class SystemRepository extends SystemBaseRepository {
  constructor(
    @InjectRepository(System)
    repository: Repository<System>,
    pagination: Pagination,
  ) {super(repository, pagination);}

  async createSystem(createSystemDto: CreateSystemDto): Promise<System> {
    const newSystem = this.repository.create({
      ...createSystemDto
    });
    return await this.repository.save(newSystem);
  }

  async updateSystem(system: System, updateSystemDto: UpdateSystemDto): Promise<boolean> {
    this.repository.merge(system, {
      update_date: new Date(),
      ...updateSystemDto
    });
    const result = await this.repository.save(system);
    return result ? true : false;
  }
}