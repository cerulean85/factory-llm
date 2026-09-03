import { Controller, Post, Body, Get, Param, BadRequestException, Put, Delete, UseGuards} from '@nestjs/common';
import { RemoteService } from './remote.service';
import { CreateRemoteDto } from './dto/request/create-remote.dto';
import { RemoteResponseDto } from './dto/response/remote-response.dto';
import { UpdateRemoteDto } from './dto/request/update-remote.dto';
import { plainToInstance } from 'class-transformer';
import { JwtServiceAuthGuard } from '../../../core/auth/jwt/jwt-service.guard';
import { ResponseStatusDto } from 'src/common/dto/response-status.dto';
import { FilteringRemoteDto } from './dto/request/filtering-remote.dto';

@Controller('setting/remote')
export class RemoteController {
  constructor(
    private readonly remoteService: RemoteService,
  ) {}
  //#region POST
  //모든 remote 조회
  @Post('get-all-remote')
  @UseGuards(JwtServiceAuthGuard)
  async findAllRemote(): Promise<RemoteResponseDto[]>{
    const remotes = await this.remoteService.getAllRemote();
    return plainToInstance(RemoteResponseDto, remotes, {
      excludeExtraneousValues: true
    });
  }
  
  //seqId에 해당하는 remote 조회
  @Post('get-remote-by-user-seq-id')
  @UseGuards(JwtServiceAuthGuard)
  async findRemoteBySeqId(
      @Body() filterDto: FilteringRemoteDto
    ): Promise<RemoteResponseDto[]> {
    const remotes =  await this.remoteService.getRemoteByseqId(filterDto.userSeqId);
    return plainToInstance(RemoteResponseDto, remotes, {
      excludeExtraneousValues: true
    });
  }

  // remote 목록 추가
  @Post('create-remote')
  @UseGuards(JwtServiceAuthGuard)
  async createRemoteBySeqId(
    @Body() createRemoteDto: CreateRemoteDto
  ): Promise<RemoteResponseDto>{
    const createdData = this.remoteService.createRemote(createRemoteDto);
    return plainToInstance(RemoteResponseDto, createdData, {
      excludeExtraneousValues: true
    });
  }
  //#endregion

  // #region PUT
  // remote 수정
  @Put('update-remote/:remoteId')
  @UseGuards(JwtServiceAuthGuard)
  async updateRemoteById(
    @Param('remoteId') remoteId: number,
    @Body() updateRemoteDto: UpdateRemoteDto
  ): Promise<ResponseStatusDto>{
    return this.remoteService.updateRemote(remoteId, updateRemoteDto);
  }
  // #endreigon

  // #region DELETE
  // remote 데이터 삭제
  @Delete('delete-remote/:remoteId')
  @UseGuards(JwtServiceAuthGuard)
  async softDeleteRemoteById(
    @Param('remoteId') remoteId: number
  ): Promise<ResponseStatusDto>{
    return this.remoteService.deleteRemoteById(remoteId);
  };
}