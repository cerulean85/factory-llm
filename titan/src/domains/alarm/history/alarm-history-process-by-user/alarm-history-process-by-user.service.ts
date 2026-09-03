import { Logger, Injectable, NotFoundException,  forwardRef, Inject } from '@nestjs/common';
import { PaginationRequestDto } from 'src/common/dto/pagination-request.dto';
import { CreateAlarmHistoryProcessByUserDto } from './dto/create-alarm-history-process-by-user.dto';
import { AlarmHistoryProcessByUserRepository } from './repositories/alarm-history-process-by-user.repository';
import { UsersService } from 'src/domains/users/users/users.service';
import { AlarmHistoryService } from '../alarm-history/alarm-history.service';
import { AssignUsersToAlarmHistoryDto } from './dto/assign-users-to-alarm-history.dto';
import { Transactional } from 'typeorm-transactional';
import { FilteringAlarmHistoryProcessByUserDto } from './dto/filtering-alarm-history-process-by-user.dto';

@Injectable()
export class AlarmHistoryProcessByUserService {
    private readonly logger = new Logger(AlarmHistoryProcessByUserService.name)
    constructor(
    private readonly alarmHistoryProcessByUserRepository: AlarmHistoryProcessByUserRepository,
    
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,

    @Inject(forwardRef(() => AlarmHistoryService))
    private readonly alarmHistoryService: AlarmHistoryService
  ) {}

  async createRelation(createAlarmHistoryProcessByUserDto: CreateAlarmHistoryProcessByUserDto) {
    const userSeqId = createAlarmHistoryProcessByUserDto.user_seq_id;
    const alarmHistoryId = createAlarmHistoryProcessByUserDto.alarm_history_id;

    const user = await this.usersService.findUsersEntityBySeqId(userSeqId);
    const alarmHistory = await this.alarmHistoryService.getAlarmHistoryEntityById(alarmHistoryId);
    if (!user) {
      this.logger.warn(`User with seqId ${userSeqId} not found`);
      throw new NotFoundException(`User with seqId ${userSeqId} not found`);
    }
    if (!alarmHistory) {
      this.logger.warn(`AlarmHistory with ID ${alarmHistoryId} not found`);
      throw new NotFoundException(`AlarmHistory with ID ${alarmHistoryId} not found`);
    }

    const newData = await this.alarmHistoryProcessByUserRepository.createRelation(user, alarmHistory);
    return newData;
  }

  @Transactional()
  async createRelationList(createDto: AssignUsersToAlarmHistoryDto) {
    let { alarmHistoryId, userSeqIdList } = createDto;
    const alarmHistory = await this.alarmHistoryService.getAlarmHistoryEntityById(alarmHistoryId);
    if (!alarmHistory) {
      throw new NotFoundException(`AlarmHistory with ID ${alarmHistoryId} not found`);
    }

    if(!userSeqIdList)
    {
      const relationEntities =  await this.findRelationEntitiesByAlarmHistoryId(alarmHistoryId)
      userSeqIdList = relationEntities.map(item => item.users.seq_id);
    }
    
    // 기존 관계 제거
    await this.alarmHistoryProcessByUserRepository.deleteRelation(alarmHistoryId);

    // 새 유저들 할당
    const users = await this.usersService.findUsersBySeqIdList(userSeqIdList); // 배열로 조회
    
    if (users.length !== userSeqIdList.length) {
      const foundIds = users.map(u => u.seq_id);
      const missing = userSeqIdList.filter(id => !foundIds.includes(id));
      throw new NotFoundException(`Users not found: ${missing.join(', ')}`);
    }

    if(users.length > 0){
      const newRelations = await this.alarmHistoryProcessByUserRepository.bulkCreateRelations(users, alarmHistory);
      return newRelations;
    } else {
      return [];
    }
  }

  async findAllRelation(paginationRequestDto : PaginationRequestDto) {
    const filterDto = new FilteringAlarmHistoryProcessByUserDto();
    Object.assign(filterDto, paginationRequestDto);
    const dataList = await this.alarmHistoryProcessByUserRepository.getFilteredPaginatedList({ filter: filterDto });
    return dataList;

  }

  async findRelationByUserId(userSeqId: number){
    const filterDto = new FilteringAlarmHistoryProcessByUserDto();
    filterDto.userSeqId = userSeqId;
    const resultList = await this.alarmHistoryProcessByUserRepository.getFilteredList({ filter: filterDto });
    return resultList;
  }

  async findRelationEntitiesByAlarmHistoryId(alarmHistoryId: number){
    const filterDto = new FilteringAlarmHistoryProcessByUserDto();
    filterDto.alarmHistoryId = alarmHistoryId;
    const resultList = await this.alarmHistoryProcessByUserRepository.getFilteredList({ filter: filterDto });
    return resultList;
  }

  async deleteRelation(
    alarmHistoryId?: number,
    userSeqId?: number
  ): Promise<boolean> {
    const result = await this.alarmHistoryProcessByUserRepository.deleteRelation(alarmHistoryId, userSeqId);

    if (!result) {
      if (alarmHistoryId && userSeqId) {
        this.logger.warn(`No relation found for AlarmHistoryId ${alarmHistoryId} and UserSeqId ${userSeqId}`);
        throw new NotFoundException(`No relation found for AlarmHistoryId ${alarmHistoryId} and UserSeqId ${userSeqId}`);
      } else if (alarmHistoryId) {
        this.logger.warn(`AlarmHistoryId ${alarmHistoryId} not found`);
        throw new NotFoundException(`AlarmHistoryId ${alarmHistoryId} not found`);
      } else if (userSeqId) {
        this.logger.debug(`The user does not have any associated relations : ${userSeqId}`);
        // NotFoundException을 던지지 않고 성공 응답만 반환
      } else {
        this.logger.warn('No condition provided for deleteRelation');
        throw new NotFoundException('No condition provided for deleteRelation');
      }
    }

    return true;
  }
}