import { Controller, Post, Body, Param, ParseIntPipe, Delete, UseGuards, Put } from '@nestjs/common';

import { NotiResponseDto } from './dto/response/noti-response.dto';
import { CreateNotiDto } from './dto/request/create-noti.dto';
import { NotiService } from './noti.service';
import { UpdateNotiDto } from './dto/request/update-noti.dto';

import { plainToInstance } from 'class-transformer';
import { JwtServiceAuthGuard } from '../../core/auth/jwt/jwt-service.guard';
import { ResponseStatusDto } from 'src/common/dto/response-status.dto';
import { FilteringNotiDto } from './dto/request/filtering-noti.dto';

import { Pagination } from 'src/utils/pagination.util';
import { ApiBody, ApiParam, ApiQuery } from '@nestjs/swagger';
import { ApiPaginatedReturn } from 'src/common/decorator/api-paginated-return.decorator';
import { ApiReturn } from 'src/common/decorator/api-return.decorator';
import { PaginationResponseDto } from 'src/common/dto/pagination-response.dto';
import { InitEndOfDay, InitStartOfDay } from 'src/utils/date-transform.util';

@Controller('noti')
export class NotiController {
  constructor(
    private readonly notiService: NotiService,
  ) {}
  //#region GET
  //모든 공지 조회
  @Post('get-all-noti')
  @UseGuards(JwtServiceAuthGuard)
  @ApiPaginatedReturn(NotiResponseDto, "모든 공지 조회", "등록된 모든 공지 조회", "모든 공지" )
  async getAllNoti(
    @Body() filteringNotiDto: FilteringNotiDto,
  ): Promise<PaginationResponseDto<NotiResponseDto>> {
    if (filteringNotiDto.startDate) {
      filteringNotiDto.startDate = InitStartOfDay(filteringNotiDto.startDate);
    }
    if (filteringNotiDto.endDate) {
      filteringNotiDto.endDate = InitEndOfDay(filteringNotiDto.endDate);
    }
    const findedData = await this.notiService.getAllNoti(filteringNotiDto);
    const result = Pagination.transformPaginatedData(NotiResponseDto, filteringNotiDto, findedData);
    return result;
  };

  //최근 공지 조회
  @Post('get-recently-noti-list')
  @UseGuards(JwtServiceAuthGuard)
  @ApiReturn(Array, "최근 공지 조회", "최근 공지 조회", "최근 공지" )
  async getRecentlyNotiList(): Promise<{}> {
    const result = await this.notiService.getRecentlyNotiList();
    result['week'] = plainToInstance(NotiResponseDto, result['week'], { excludeExtraneousValues: true });
    result['thirty'] = plainToInstance(NotiResponseDto, result['thirty'], { excludeExtraneousValues: true });
    return result;
  };

  //특정 공지 조회
  @Post('get-noti-by-id')
  @UseGuards(JwtServiceAuthGuard)
  @ApiBody({ type: Number, description: '공지 ID' })
  @ApiReturn(NotiResponseDto, "특정 공지 조회", "특정 공지 조회", "특정 공지" )
  async getNoti(
    @Body() filteringNotiDto: FilteringNotiDto
  ): Promise<NotiResponseDto>{
    const findedData = await this.notiService.findNotiById(filteringNotiDto.notiId as number);
    const result = plainToInstance(NotiResponseDto, findedData, { excludeExtraneousValues: true });
    return result;
  };
  //#endregion

  //#region POST
  //노티 생성
  @Post('create-noti')
  @UseGuards(JwtServiceAuthGuard)
  @ApiBody({ type : CreateNotiDto })
  @ApiReturn(NotiResponseDto, "공지 등록", "공지 등록", "공지" )
  async createNoti(
    @Body() createNotiDto: CreateNotiDto
  ): Promise<NotiResponseDto>{
    const createdData = this.notiService.createNoti(createNotiDto, true);
    const result = plainToInstance(NotiResponseDto, createdData, { excludeExtraneousValues: true });
    return result;
  };
  //#endregion

  // #region PATCH
  //노티 업데이트
  @Put('update-noti/:notiId')
  @UseGuards(JwtServiceAuthGuard)
  @ApiParam({ name: 'notiId', type: Number, description: '공지 ID' })
  @ApiBody({ type : UpdateNotiDto })
  @ApiReturn(ResponseStatusDto, "공지 수정", "공지 수정", "공지 수정" )
  async updateNoti(
    @Param('notiId', ParseIntPipe) notiId: number,
    @Body() updateNotiDto: UpdateNotiDto
  ): Promise<ResponseStatusDto>{
    const result = this.notiService.updateNoti(notiId, updateNotiDto);
    return result;
  };
  // #endregion

  // #region DELETE
  //노티 삭제
  @Delete('soft-delete-noti/:notiId')
  @UseGuards(JwtServiceAuthGuard)
  @ApiParam({ name: 'notiId', type: Number, description: '공지 ID' })
  @ApiReturn(ResponseStatusDto, "공지 삭제", "공지 삭제", "공지 삭제" )
  async softDeleteNoti(
    @Param('notiId', ParseIntPipe) notiId: number,
  ): Promise<ResponseStatusDto>{
    const result = this.notiService.softDeleteNotiById(notiId);
    return result
  };
  // #endregion
}