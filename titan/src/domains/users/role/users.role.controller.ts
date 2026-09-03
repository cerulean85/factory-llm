import { Controller, Post, Body, Get, Param, BadRequestException, ParseIntPipe, Delete, UseGuards } from '@nestjs/common';
import { CreateRoleDto } from './dto/request/create-role.dto';
import { RoleService } from './role.service';
import { RoleResponseDto } from './dto/response/role-response.dto';

import { plainToInstance } from 'class-transformer';
import { JwtServiceAuthGuard } from '../../../core/auth/jwt/jwt-service.guard';
import { ResponseStatusDto } from 'src/common/dto/response-status.dto';

@Controller('users')
export class UsersRoleController {
  constructor(
    private readonly roleService: RoleService,
  ) {}
  //#region GET
  //SeqID에 해당하는 권한 조회
  @Get(':userSeqId/role')
  @UseGuards(JwtServiceAuthGuard)
  async getRoleWithUsersBySeqId(
      @Param('userSeqId') userSeqId: number
    ): Promise<RoleResponseDto[]> {

    if (!userSeqId) {
      throw new BadRequestException('query parameter is required');
    }
    const roles =  await this.roleService.getRoleByUserSeqId(userSeqId, true);
    return plainToInstance(RoleResponseDto, roles, {
      excludeExtraneousValues: true
    });
  }
   
  //#endregion

  //#region POST
  //SeqID에 해당하는 권한 추가
  @Post(':userSeqId/role')
  @UseGuards(JwtServiceAuthGuard)
  async CreateRole(
      @Param('userSeqId', ParseIntPipe) userSeqId: number,
      @Body() createRoleDto: CreateRoleDto
    ): Promise<RoleResponseDto> {
      const createdData = await this.roleService.createRole(userSeqId, createRoleDto);
      return plainToInstance(RoleResponseDto, createdData, {
        excludeExtraneousValues: true
      });
  }
  //#endregion

  // #region PATCH
  //유저 특정 권한 삭제
  @Delete(':userSeqId/role/:roleId/soft')
  @UseGuards(JwtServiceAuthGuard)
  async SoftDeleteRoleWithUsersBySeqId(
    @Param('roleId', ParseIntPipe) roleId: number,
    @Param('userSeqId', ParseIntPipe) userSeqId: number,
  ): Promise<ResponseStatusDto> {
    const result = await this.roleService.softDeleteByUserSeqId(userSeqId, roleId);
    return result
  };

  //유저 모든 권한 삭제
  @Delete(':userSeqId/role/soft')
  @UseGuards(JwtServiceAuthGuard)
  async SoftDeleteAllRoleWithUsersBySeqId(
    @Param('userSeqId', ParseIntPipe) userSeqId: number,
  ): Promise<ResponseStatusDto> {
    const result = await this.roleService.softDeleteAllByUserSeqId(userSeqId);
    return result
  };
  // #endregion
}