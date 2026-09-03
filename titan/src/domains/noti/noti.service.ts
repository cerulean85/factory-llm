import { Logger, Injectable, NotFoundException,  InternalServerErrorException, forwardRef, Inject } from '@nestjs/common';

import { NotiRepository } from './repositories/noti.repository';
import { CreateNotiDto } from './dto/request/create-noti.dto';
import { Noti } from './entities/noti.entity';
import { UpdateNotiDto } from './dto/request/update-noti.dto';
import { UsersService } from '../users/users/users.service';
import { ResponseStatusDto } from 'src/common/dto/response-status.dto';
import { PaginationRequestDto } from 'src/common/dto/pagination-request.dto';
import { FilteringNotiDto } from './dto/request/filtering-noti.dto';
import { PaginationResponseDto } from 'src/common/dto/pagination-response.dto';
import { ORDER } from 'src/common/enum/db.enum';
import { SseService } from 'src/core/sse/sse.service';
import { plainToInstance } from 'class-transformer';
import { NotiResponseDto } from './dto/response/noti-response.dto';
import { NotiOrderKey } from './repositories/noti.base.repository';
import { SSE_EVENT_TYPE } from 'src/common/enum/sse.enum';
@Injectable()
export class NotiService {
    private readonly logger = new Logger(NotiService.name)
    constructor(
    private readonly notiRepository: NotiRepository,
    private readonly usersService: UsersService,
    private readonly sseService: SseService,
  ) {}

  async createNoti(createNotiDto: CreateNotiDto, resultSendFlag: boolean = false) {
    const { users_seq_id: usersSeqId } = createNotiDto;
    const users = usersSeqId ? await this.usersService.findUsersEntityBySeqId(usersSeqId) : undefined;
    if(!users){
      this.logger.warn(`User with ID ${usersSeqId} not found`);
      throw new NotFoundException(`User with ID ${usersSeqId} not found`);
    }
    const newNoti = await this.notiRepository.createNoti(users, createNotiDto);

    if(resultSendFlag === true){
      const notiRes = plainToInstance(NotiResponseDto, newNoti, { excludeExtraneousValues: true });
      this.sseService.sendEventToAll(SSE_EVENT_TYPE.CREATE_NOTI_TRIGGER, notiRes)
    }

    return newNoti;
  };

  async updateNoti(notiId: number, updateNotiDto: UpdateNotiDto): Promise<ResponseStatusDto>{
    const { users_seq_id: usersSeqId } = updateNotiDto;
    const filterDto = new FilteringNotiDto();
    filterDto.notiId = notiId;

    const noti = await this.notiRepository.getFilteredOne({ filter: filterDto });
    if (!noti) {
      this.logger.warn(`Noti with ID ${notiId} not found`);
      throw new NotFoundException(`Noti with ID ${notiId} not found`);
    };
    const users = usersSeqId ? await this.usersService.findUsersEntityBySeqId(usersSeqId) : noti.users;
    if(!users){
      this.logger.warn(`User with ID ${usersSeqId} not found`);
      throw new NotFoundException(`User with ID ${usersSeqId} not found`);
    };
    const result = await this.notiRepository.updateNoti(noti, users, updateNotiDto);

    if (!result) {
      this.logger.warn(`Failed to update noti with ID ${notiId}`);
      throw new InternalServerErrorException(`Failed to update noti with ID ${notiId}`);
    };

    let resStatusDto = new ResponseStatusDto();
    resStatusDto.isSuccess = result;
    resStatusDto.message = result ? 'Noti updated successfully' : 'Failed to update noti';
    return resStatusDto;
  };

  async getAllNoti(paginationRequest: PaginationRequestDto): Promise<PaginationResponseDto<Noti>> {
    const pageRes = await this.notiRepository.getFilteredPaginatedList({ filter: paginationRequest as FilteringNotiDto, orderMap: { [NotiOrderKey.ID]: ORDER.DESC } });
    return pageRes;
  };

  async findNotiById(notiId: number): Promise<Noti> {
    const filterDto = new FilteringNotiDto();
    filterDto.notiId = notiId;

    const noti = await this.notiRepository.getFilteredOne({ filter: filterDto });
    if (!noti) {
      this.logger.warn(`Noti not found : ${notiId}`);
      throw new NotFoundException(`Noti not found : ${notiId}`);
    };
    return noti;
  };

  async softDeleteNotiById(notiId: number): Promise<ResponseStatusDto>{
    const result = await this.notiRepository.softDeleteNotiById(notiId);
    if(!result){
      this.logger.warn('Failed to delete');
      throw new NotFoundException(`Noti with ID ${notiId} not found`);
    };
    let resStatusDto = new ResponseStatusDto();
    resStatusDto.isSuccess = result;
    resStatusDto.message = result ? 'Noti deleted successfully' : 'Failed to delete noti';
    return resStatusDto;
  };

  async getRecentlyNotiList(): Promise<{ week: any[], thirty: any[] }> {
    let result : { week: any[], thirty: any[] } = {
      week: [],
      thirty: []
    };
    
    // 7일 이내 데이터 조회
    const filterDto1 = new FilteringNotiDto();
    filterDto1.startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const weekList = await this.notiRepository.getFilteredList({
      filter: filterDto1,
      orderMap: { [NotiOrderKey.ID]: ORDER.DESC }
    });
  
    // 7일~30일 사이 데이터 조회
    const filterDto2 = new FilteringNotiDto();
    filterDto2.startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    filterDto2.endDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const thirtyList = await this.notiRepository.getFilteredList({
      filter: filterDto2,
      orderMap: { [NotiOrderKey.ID]: ORDER.DESC }
    });
  
    result.week = weekList;
    result.thirty = thirtyList;
    return result;
  };
};