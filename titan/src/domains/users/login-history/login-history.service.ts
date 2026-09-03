import { Logger, Injectable, NotFoundException, forwardRef, Inject } from '@nestjs/common';
import { LoginHistory } from './entities/login-history.entity';
import { LoginHistoryRepository } from './respositories/login-history.repository';
import { CreateLoginHistoryDto } from './dto/request/create-login-history.dto';
import { UsersService } from '../users/users.service';
import { FilteringLoginHistoryDto } from './dto/request/filtering-login-history.dto';
import { PaginationResponseDto } from 'src/common/dto/pagination-response.dto';
import { PaginationRequestDto } from 'src/common/dto/pagination-request.dto';
import { ORDER } from 'src/common/enum/db.enum';
import { LoginHistoryOrderKey } from './respositories/login-history.base.repository';

@Injectable()
export class LoginHistoryService {
    private readonly logger = new Logger(LoginHistoryService.name)
    constructor(
    private readonly loginHistoryRepository: LoginHistoryRepository,

    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService
  ) {}

  async createLoginHistory(createLoginHistoryDto: CreateLoginHistoryDto) {
    const userSeqId = createLoginHistoryDto.user_seq_id;
    const user = await this.usersService.findUsersEntityBySeqId(userSeqId)
    if (!user) {
      this.logger.warn(`User with seqId ${userSeqId} not found`);
      throw new NotFoundException(`User with seqId ${userSeqId} not found`);
    }
    const newLoginHistory = await this.loginHistoryRepository.createLoginHistory(user, createLoginHistoryDto);
    return newLoginHistory;
  }

  async getAllLoginHistory(paginationRequestDto : PaginationRequestDto) : Promise<PaginationResponseDto<LoginHistory>> {
    const loginHistoryList = await this.loginHistoryRepository.getFilteredPaginatedList({filter : paginationRequestDto as FilteringLoginHistoryDto, orderMap: { [LoginHistoryOrderKey.ID]: ORDER.DESC }});
    return loginHistoryList;
  }

  async findLoginHistoriesByUserSeqId(userSeqId : number) : Promise<PaginationResponseDto<LoginHistory>>{
    const filterDto = new FilteringLoginHistoryDto();
    filterDto.userSeqId = userSeqId;
    const findUser = await this.usersService.findUsersEntityBySeqId(userSeqId);
    if (!findUser) {
      this.logger.warn(`user not found`);
      throw new NotFoundException(`user not found`);
    }
    const result = await this.loginHistoryRepository.getFilteredPaginatedList({ filter: filterDto, orderMap: { [LoginHistoryOrderKey.ID]: ORDER.DESC } });
    return result;
  }
}