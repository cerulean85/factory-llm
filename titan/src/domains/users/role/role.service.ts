import { Logger, Injectable, NotFoundException,  forwardRef, Inject } from '@nestjs/common';
import { RoleRepository } from './respositories/role.repository';
import { CreateRoleDto } from './dto/request/create-role.dto';
import { Role } from './entities/role.entity';

import { UsersService } from '../users/users.service';
import { ResponseStatusDto } from 'src/common/dto/response-status.dto';
import { PaginationRequestDto } from 'src/common/dto/pagination-request.dto';
import { PaginationResponseDto } from 'src/common/dto/pagination-response.dto';
import { FilteringRoleDto } from './dto/request/filtering-role.dto';

@Injectable()
export class RoleService {
    private readonly logger = new Logger(RoleService.name)
    constructor(
    private readonly roleRepository: RoleRepository,
    private readonly usersService: UsersService
  ) {}

  async createRole(userSeqId: number, createRoleDto: CreateRoleDto) {
    const user = await this.usersService.findUsersEntityBySeqId(userSeqId)
    if (!user) {
      throw new NotFoundException(`User with seq_id ${userSeqId} not found`);
    }
    const newRole = await this.roleRepository.createRole(user, createRoleDto);
    return newRole;
  }

  async getRoleById(id: number, validRecord: boolean = true): Promise<Role> {
    const filter = new FilteringRoleDto();
    filter.id = id;
    filter.validRecord = validRecord;
    const role = await this.roleRepository.getFilteredOne({ filter: filter });
    if (!role) {
      this.logger.warn(`Permission not found : ${id}`);
      throw new NotFoundException(`Permission not found : ${id}`);
    };
    return role;
  }

  async getAllRole(paginationRequestDto : PaginationRequestDto): Promise<PaginationResponseDto<Role>>{
    const roleList = await this.roleRepository.getFilteredPaginatedList({ filter: paginationRequestDto as FilteringRoleDto });
    return roleList;
  }

  async getRoleByUserSeqId(userSeqId: number, validRecord: boolean) : Promise<Role[]> {
    const filter = new FilteringRoleDto();
    filter.userSeqId = userSeqId;
    filter.validRecord = validRecord;
    const roleList = await this.roleRepository.getFilteredList({ filter: filter });
      if (!roleList){
        this.logger.warn(`Permission not found`);
        throw new NotFoundException(`Permission not found`);
      };
      return roleList;

  }

  async softDeleteByUserSeqId(userSeqId: number, roleId: number): Promise<ResponseStatusDto>{
    const result = await this.roleRepository.softDeleteRole(userSeqId, roleId);
    if(!result){
      this.logger.warn('Failed to delete');
      throw new NotFoundException(`Role with ID ${roleId} for User ${userSeqId} not found`);
    };
    let resStatusDto = new ResponseStatusDto();
    resStatusDto.isSuccess = result;
    resStatusDto.message = result ? 'Role deleted successfully' : 'Failed to delete role';
    return resStatusDto;
  }

  async softDeleteAllByUserSeqId(userSeqId: number): Promise<ResponseStatusDto>{
    const result = await this.roleRepository.softDeleteAllRole(userSeqId);
    if(!result){
      this.logger.warn('Failed to delete');
      throw new NotFoundException(`User ${userSeqId} not found`);
    };
    let resStatusDto = new ResponseStatusDto();
    resStatusDto.isSuccess = result;
    resStatusDto.message = result ? 'Role deleted successfully' : 'Failed to delete role';
    return resStatusDto;
  }
}