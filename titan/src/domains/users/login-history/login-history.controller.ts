import { Controller, Post, UseGuards, Body } from '@nestjs/common';
import { LoginHistoryService } from './login-history.service';
import { LoginHistoryResponseDto } from './dto/response/login-history-response.dto';
import { JwtServiceAuthGuard } from '../../../core/auth/jwt/jwt-service.guard';
import { FilteringLoginHistoryDto } from './dto/request/filtering-login-history.dto';
import { Pagination } from 'src/utils/pagination.util';
import { ApiBody } from '@nestjs/swagger';
import { ApiPaginatedReturn } from 'src/common/decorator/api-paginated-return.decorator';
import { PaginationResponseDto } from 'src/common/dto/pagination-response.dto';

//모든 history 조회
@Controller('history')
export class LoginHistoryController {
  constructor(
    private readonly loginHistoryService: LoginHistoryService,
  ) {}
  @Post('get-all-login-history')
  @UseGuards(JwtServiceAuthGuard)
  @ApiBody({ type: FilteringLoginHistoryDto })
  @ApiPaginatedReturn(LoginHistoryResponseDto, "모든 로그인 이력 조회", "모든 로그인 이력 조회", "모든 로그인 이력")
  async getAllLoginHistory(
    @Body() filteringLoginHistoryDto : FilteringLoginHistoryDto
  ): Promise<PaginationResponseDto<LoginHistoryResponseDto>> {
    const findedData = await this.loginHistoryService.getAllLoginHistory(filteringLoginHistoryDto);
    const result = Pagination.transformPaginatedData(LoginHistoryResponseDto, filteringLoginHistoryDto, findedData);
    return result;
  };
};