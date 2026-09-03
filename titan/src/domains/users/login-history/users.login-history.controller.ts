import { Controller, Post, Body, BadRequestException, UseGuards } from '@nestjs/common';
import { LoginHistoryService } from './login-history.service';
import { CreateLoginHistoryDto } from './dto/request/create-login-history.dto';
import { LoginHistoryResponseDto } from './dto/response/login-history-response.dto';

import { plainToInstance } from 'class-transformer';
import { JwtServiceAuthGuard } from '../../../core/auth/jwt/jwt-service.guard';
import { ApiReturn } from 'src/common/decorator/api-return.decorator';
import { PaginationResponseDto } from 'src/common/dto/pagination-response.dto';
import { Pagination } from 'src/utils/pagination.util';
import { FilteringLoginHistoryDto } from './dto/request/filtering-login-history.dto';
import { ApiBody } from '@nestjs/swagger';
@Controller('users/history')
export class UsersLoginHistoryController {
  constructor(
    private readonly loginHistoryService: LoginHistoryService,
  ) {}
  //#region GET

  //SeqID에 해당하는 히스토리 조회
  @Post('get-users-login-history')
  @UseGuards(JwtServiceAuthGuard)
  @ApiBody({ type: FilteringLoginHistoryDto })
  @ApiReturn(LoginHistoryResponseDto, "특정 로그인 이력 조회", "특정 로그인 이력 조회", "특정 로그인 이력")
  async getLoginHistoryByUserSeqId(
      @Body() filteringLoginHistoryDto: FilteringLoginHistoryDto
    ): Promise<PaginationResponseDto<LoginHistoryResponseDto>> {

    if (!filteringLoginHistoryDto.userSeqId) {
      throw new BadRequestException('Body parameter is required');
    }
    const histories =  await this.loginHistoryService.findLoginHistoriesByUserSeqId(filteringLoginHistoryDto.userSeqId);
    const result = Pagination.transformPaginatedData(LoginHistoryResponseDto, filteringLoginHistoryDto, histories);
    return result;
  }
  //#endregion
}