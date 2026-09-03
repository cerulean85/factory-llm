import { Controller, Post, Body, Get, Param, Query, ParseIntPipe, Delete, UseGuards, Put } from '@nestjs/common';


import { plainToInstance } from 'class-transformer';
import { JwtServiceAuthGuard } from '../../../../core/auth/jwt/jwt-service.guard';
import { ResponseStatusDto } from 'src/common/dto/response-status.dto';

import { Pagination } from 'src/utils/pagination.util';
import { ApiBody, ApiParam, ApiQuery } from '@nestjs/swagger';
import { ApiPaginatedReturn } from 'src/common/decorator/api-paginated-return.decorator';
import { ApiReturn } from 'src/common/decorator/api-return.decorator';
import { MessageDispatchHistoryService } from './message-dispatch-history.service';
import { MessageDispatchHistoryResponseDto } from './dto/response/message-dispatch-history-response.dto';
import { FilteringMessageDispatchHistoryDto } from './dto/request/filtering-message-dispatch-history.dto';

@Controller('message-dispatch-history')
export class MessageDispatchHistoryController {
  constructor(
    private readonly msgHistoryService: MessageDispatchHistoryService,
  ) {}

  //#region GET (POST)
  @Post('get-by-history-id')
  @UseGuards(JwtServiceAuthGuard)
  @ApiBody({ type : FilteringMessageDispatchHistoryDto })
  @ApiPaginatedReturn(MessageDispatchHistoryResponseDto, "히스토리에 해당하는 메세지 전송 이력", "히스토리에 해당하는 메세지 전송 이력", "메세지 전송 이력" )
  async getMessageDispatchHistory(
    @Body() filteringDto: FilteringMessageDispatchHistoryDto,
  ) {
    const findedData = await this.msgHistoryService.filterMessageDispatchHistory(filteringDto);
    const result = Pagination.transformPaginatedData(MessageDispatchHistoryResponseDto, filteringDto, findedData);//plainToInstance(MessageDispatchHistoryResponseDto, findedData, { excludeExtraneousValues: true });
    return result;
  };

  //#endregion

  //#region POST
  //#endregion

  // #region PATCH
  // #endregion

  // #region DELETE
  // #endregion
}