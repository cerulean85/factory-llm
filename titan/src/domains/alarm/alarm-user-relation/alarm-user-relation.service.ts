import { Logger, Injectable, NotFoundException, forwardRef, Inject } from '@nestjs/common';
import { AlarmUserRelationRepository } from './repositories/alarm-user-relation.repository';
import { CreateAlarmUserRelationDto } from './dto/create-alarm-user-relation.dto';
import { PaginationRequestDto } from 'src/common/dto/pagination-request.dto';
import { UsersService } from 'src/domains/users/users/users.service';
import { AlarmService } from '../alarm/alarm.service';
import { ResponseStatusDto } from 'src/common/dto/response-status.dto';
  import { FilteringAlarmUserRelationDto } from './dto/filtering-alarm-user-relation.dto';
@Injectable()
export class AlarmUserRelationService {
    private readonly logger = new Logger(AlarmUserRelationService.name)
    constructor(
    private readonly alarmUserRelationRepository: AlarmUserRelationRepository,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    @Inject(forwardRef(() => AlarmService))
    private readonly alarmService: AlarmService
  ) {}

  async createAlarmUserRelation(createAlarmUserRelationDto: CreateAlarmUserRelationDto) {
    const userSeqId = createAlarmUserRelationDto.user_seq_id;
    const alarmId = createAlarmUserRelationDto.alarm_id;

    const user = await this.usersService.findUsersEntityBySeqId(userSeqId);
    const alarm = await this.alarmService.getAlarmEntityById(alarmId);
    if (!user) {
      this.logger.warn(`User with seqId ${userSeqId} not found`);
      throw new NotFoundException(`User with seqId ${userSeqId} not found`);
    };
    if (!alarm) {
      this.logger.warn(`Alarm with ID ${alarmId} not found`);
      throw new NotFoundException(`Alarm with ID ${alarmId} not found`);
    };

    const newAlarmUserRelation = await this.alarmUserRelationRepository.createAlarmUserRelation(user, alarm);
    return newAlarmUserRelation;
  };

  async findAllAlarmUserRelation(paginationRequestDto : PaginationRequestDto){
    const alarmUserRelationList = await this.alarmUserRelationRepository.getFilteredPaginatedList({ filter: paginationRequestDto as FilteringAlarmUserRelationDto });
    return alarmUserRelationList;
  };

  async findRelationByUsers(userSeqId: number, paginationRequestDto : PaginationRequestDto) {
    const filter = new FilteringAlarmUserRelationDto();
    filter.userSeqId = userSeqId;
    Object.assign(filter, paginationRequestDto);
    const resultList = await this.alarmUserRelationRepository.getFilteredPaginatedList({ filter: filter });
    return resultList;
  };

  async findRelationByAlarm(alarmId: number, paginationRequestDto : PaginationRequestDto) {
    const filter = new FilteringAlarmUserRelationDto();
    filter.alarmId = alarmId;
    Object.assign(filter, paginationRequestDto);
    const resultList = await this.alarmUserRelationRepository.getFilteredPaginatedList({ filter: filter });
    return resultList;
  };

  async deleteAlarmUserRelationByAlarmId(alarmIdList : number[]): Promise<ResponseStatusDto> {
    const result = await this.alarmUserRelationRepository.deleteAlarmUserRelationByAlarmId(alarmIdList);
    if(!result) {
      this.logger.warn(`Failed to delete : User ${alarmIdList} not found`);
    };
    let resStatusDto = new ResponseStatusDto();
    resStatusDto.isSuccess = true;
    return resStatusDto;
  };

  
  async deleteAlarmUserRelationByUserSeqId(userSeqId : number): Promise<ResponseStatusDto> {
    const result = await this.alarmUserRelationRepository.deleteAlarmUserRelationByUserSeqId(userSeqId);
    if(!result){
      this.logger.debug(`The user does not have any associated alarm relations : ${userSeqId}`);
    };
    let resStatusDto = new ResponseStatusDto();
    // resStatusDto.isSuccess = result;
    resStatusDto.isSuccess = true;  // result로 받으면 alarm 담당자로 지정되지 않은 사용자를 삭제할 시 오류가 발생함
    resStatusDto.message = `The user does not have any associated alarm relations : ${userSeqId}`;
    return resStatusDto;
  };

  async deleteAlarmUserRelation(alarmId: number, userSeqId: number): Promise<ResponseStatusDto> {
    const result = await this.alarmUserRelationRepository.deleteAlarmUserRelation(alarmId, userSeqId);
    if(!result){
      this.logger.debug(`The relation does not exist : userSeqId-${userSeqId} - alarmId-${alarmId}`);
    };
    let resStatusDto = new ResponseStatusDto();
    resStatusDto.isSuccess = true;
    return resStatusDto;
  };
};