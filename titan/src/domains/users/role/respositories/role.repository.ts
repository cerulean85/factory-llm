import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../entities/role.entity';
import { CreateRoleDto } from '../dto/request/create-role.dto';
import { Users } from 'src/domains/users/users/entities/users.entity';
import { Pagination } from 'src/utils/pagination.util';
import { RoleBaseRepository } from './role.base.repository';

@Injectable()
export class RoleRepository extends RoleBaseRepository {
  constructor(
    @InjectRepository(Role)
    repository: Repository<Role>,
    pagination: Pagination
  ) {super(repository, pagination);}

  async createRole(user: Users, createRoleDto: CreateRoleDto): Promise<Role> {
    const newRole = this.repository.create({
      users: user,
      ...createRoleDto});
    return await this.repository.save(newRole);
  }

  async softDeleteRole(userSeqId: number, roleId: number): Promise<boolean> {
    const result = await this.repository.update(
      { id: roleId, users: { seq_id: userSeqId} },
      { valid_record: false }
    );
    return result.affected !== undefined && result.affected > 0;
  }

  async softDeleteAllRole(userSeqId: number): Promise<boolean> {
    const result = await this.repository.update(
      { users: { seq_id: userSeqId} },
      { valid_record: false }
    );
    return result.affected !== undefined && result.affected > 0;
  }
}