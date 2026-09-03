import { Controller, Body, Get, Put, UseGuards } from '@nestjs/common';
import { SystemService } from './system.service';
import { SystemResponseDto } from './dto/response/system-response.dto';
import { UpdateSystemDto } from './dto/request/update-system.dto';
import { JwtServiceAuthGuard } from '../../../core/auth/jwt/jwt-service.guard';
import { ResponseStatusDto } from 'src/common/dto/response-status.dto';
import { ApiReturn } from 'src/common/decorator/api-return.decorator';
import { ApiBody } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { SseService } from 'src/core/sse/sse.service';
import { DEBUG_TODO_SEARCH } from 'src/config/debug.config';
import { SSE_EVENT_TYPE } from 'src/common/enum/sse.enum';

@Controller('setting/system')
export class SystemController {
  constructor(
    private readonly systemService: SystemService,
    private readonly sseService: SseService,
  ) {}

  onModuleInit() {
    this.scheduleTask();
  }
  //#region GET
  // system 조회
  @Get()
  @UseGuards(JwtServiceAuthGuard)
  @ApiReturn(
    SystemResponseDto,
    '모든 시스템 조회',
    '모든 시스템 조회',
    '모든 시스템',
  )
  async findSystemByUserSeqId(): Promise<SystemResponseDto> {
    const systemSetting = await this.systemService.getSystem();
    const result = plainToInstance(SystemResponseDto, systemSetting, {
      excludeExtraneousValues: true,
    });
    return result;
  }
  //#endregion

  // #region PUT
  // system 수정
  @Put()
  @UseGuards(JwtServiceAuthGuard)
  @ApiBody({ type: UpdateSystemDto })
  @ApiReturn(
    ResponseStatusDto,
    '시스템 수정',
    '시스템 수정',
    '시스템 수정 결과',
  )
  async updateSystemById(
    @Body() updateSystemDto: UpdateSystemDto,
  ): Promise<ResponseStatusDto> {
    const result = await this.systemService.updateSystem(updateSystemDto);
    return result;
  }
  // #endreigon

  @Get('/refresh-browser')
  async getRefreshBrowser(): Promise<boolean> {
    return this.systemService.getUpdateRefreshBrowser();
  }

  private async scheduleTask() {
    const doRefresh = await this.systemService.getUpdateRefreshBrowser();
    if (doRefresh) {
      this.sseService.sendEventToAll(SSE_EVENT_TYPE.BROWSER_REFRESH, doRefresh);
    }
    setTimeout(() => this.scheduleTask(), 1000);
  }
}
