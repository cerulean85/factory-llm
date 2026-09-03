import { Logger, Injectable, NotFoundException,  InternalServerErrorException, forwardRef, Inject, BadRequestException } from '@nestjs/common';

import { AlarmRepository } from './repositories/alarm.repository';
import { CreateAlarmDto } from './dto/request/create-alarm.dto';
import { Alarm } from './entities/alarm.entity';

import { UpdateAlarmDto } from './dto/request/update-alarm.dto';
import { SseService } from 'src/core/sse/sse.service';
import { ResponseStatusDto } from 'src/common/dto/response-status.dto';
import { FilteringAlarmDto } from './dto/request/filtering-alarm.dto';
import { PaginationRequestDto } from 'src/common/dto/pagination-request.dto';
import { AlarmUserRelationService } from '../alarm-user-relation/alarm-user-relation.service';
import { CreateAlarmUserRelationDto } from '../alarm-user-relation/dto/create-alarm-user-relation.dto';
import { Transactional } from 'typeorm-transactional';
import { Readable } from 'stream';
import { Multer } from 'multer';
import * as csv from 'csv-parser';
import { plainToInstance } from 'class-transformer';
import { AlarmResponseDto } from './dto/response/alarm-response.dto';
import { CreateFileDto } from '../../../core/file/dto/request/create-file.dto';
import { FileService } from '../../../core/file/file.service';
import { FileResponseDto } from '../../../core/file/dto/response/file-response.dto';
import { DownloadFileDto } from '../../../core/file/dto/request/download-file.dto';
import { createObjectCsvStringifier } from 'csv-writer';
import * as dayjs from 'dayjs';
import { CommonUserInfoDto } from 'src/common/dto/user-info.dto';
import { ORDER } from 'src/common/enum/db.enum';
import { AlarmOrderKey } from './repositories/alarm.base.repository';
import { EquipmentTypeService } from '../../equipment/equipment-type/equipment-type.service';
import { CreateEquipmentTypeDto } from '../../equipment/equipment-type/dto/request/create-equipment-type.dto';
import { EquipmentType } from 'src/domains/equipment/equipment-type/entities/equipment-type.entity';
import { UsersService } from 'src/domains/users/users/users.service';
import { SSE_EVENT_TYPE } from 'src/common/enum/sse.enum';


@Injectable()
export class AlarmService {
    private readonly logger = new Logger(AlarmService.name)
    constructor(
    private readonly sseService : SseService,
    private readonly alarmRepository: AlarmRepository,
    private readonly equipmentTypeService: EquipmentTypeService,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    @Inject(forwardRef(() => AlarmUserRelationService))
    private readonly alarmUserRelationService: AlarmUserRelationService,
    private readonly fileService: FileService,
  ) {}

  //sse alarm push event
  processAlarmEvent(event: any) {
    if(event?.changedTraceMessage?.TagName === 'Data106'){
      console.log(event);
    };
    //console.log('Processing alarm event:', event);
    this.sseService.sendEventToAll(SSE_EVENT_TYPE.ALARM_SEND, event);
  };

  @Transactional()
  async createAlarm(createAlarmDto: CreateAlarmDto) {
    // const queryRunner: QueryRunner = this.dataSource.createQueryRunner();
    // await queryRunner.connect();
    // await queryRunner.startTransaction();

    const { equipment_type_id: equipmentTypeId, code: code } = createAlarmDto;
    const filter = new FilteringAlarmDto();
    filter.code = code;
    filter.equipmentTypeId = equipmentTypeId;
    const alarm = await this.alarmRepository.getFilteredOne({ filter: filter });
    if (alarm) {
      this.logger.warn(`Alarm with code ${code} and equipment type ${equipmentTypeId} already exists`);
      throw new BadRequestException(`Alarm with code ${code} and equipment type ${equipmentTypeId} already exists`);
    };
    const equipmentType = await this.equipmentTypeService.getEquipmentTypeById(equipmentTypeId);

    const newAlarm = await this.alarmRepository.createAlarm(equipmentType, createAlarmDto);
    for (const userSeqId of createAlarmDto.user_seq_id_list ?? []) {
      const createRelationDto = new CreateAlarmUserRelationDto();
      createRelationDto.alarm_id = newAlarm.id;
      createRelationDto.user_seq_id = userSeqId;
      const relationResult = await this.alarmUserRelationService.createAlarmUserRelation(createRelationDto);

      if (!relationResult) {
        this.logger.warn(`Failed to create alarmUserRelation : ${userSeqId}`);
        throw new InternalServerErrorException(`Failed to create alarmUserRelation : ${userSeqId}`);
      };
    };
    //await queryRunner.commitTransaction();
    return newAlarm;
  };

  @Transactional()
  async updateAlarm(alarmId: number, updateAlarmDto: UpdateAlarmDto): Promise<ResponseStatusDto>{
    const { equipment_type_id: equipmentTypeId } = updateAlarmDto;

    const filter = new FilteringAlarmDto();
    filter.id = alarmId;
    const alarm = await this.alarmRepository.getFilteredOne({ filter: filter });
    if (!alarm) {
      this.logger.warn(`Alarm with ID ${alarmId} not found`);
      throw new NotFoundException(`Alarm with ID ${alarmId} not found`);
    };

    const equipmentType = equipmentTypeId ? await this.equipmentTypeService.getEquipmentTypeById(equipmentTypeId) : alarm.equipment_type;
    const isSuccess = await this.alarmRepository.updateAlarm(alarm, equipmentType, updateAlarmDto);

    const finedRelationList = await this.alarmUserRelationService.findRelationByAlarm(alarmId, new PaginationRequestDto());
    if(finedRelationList.total > 0) {
      const rst = await this.alarmUserRelationService.deleteAlarmUserRelationByAlarmId([alarmId]);
      if(rst.isSuccess == false) {
        this.logger.warn(`Failed to delete alarmProcessByUser`);
        throw new InternalServerErrorException(`Failed to delete alarmProcessByUser`);
      };
    };

    for (const userSeqId of updateAlarmDto.user_seq_id_list ?? []) {
      const createRelationDto = new CreateAlarmUserRelationDto();
      createRelationDto.alarm_id = alarmId;
      createRelationDto.user_seq_id = userSeqId;
      const relationResult = await this.alarmUserRelationService.createAlarmUserRelation(createRelationDto);

      if (!relationResult) {
        this.logger.warn(`Failed to create alarmUserRelation : ${userSeqId}`);
        throw new InternalServerErrorException(`Failed to create alarmUserRelation : ${userSeqId}`);
      };
    };

    let resStatusDto = new ResponseStatusDto();
    resStatusDto.isSuccess = isSuccess;
    resStatusDto.message = isSuccess ? 'Alarm updated successfully' : 'Failed to update alarm';
    return resStatusDto;
  };

  async getAllAlarmEntities() {
    const filter = new FilteringAlarmDto();
    const alarmList = await this.alarmRepository.getFilteredList({ filter: filter });
    if (!alarmList) {
      this.logger.warn(`Alarm not found`);
      throw new NotFoundException(`Alarm not found`);
    };
    return alarmList;
  }

  async getAlarms(filteringAlarmDto : FilteringAlarmDto) {
    const filter = new FilteringAlarmDto();
    Object.assign(filter, filteringAlarmDto);
    filter.validRecord = true;
    const alarmList = await this.alarmRepository.getFilteredPaginatedList({ filter: filter, orderMap: { [AlarmOrderKey.ID]: ORDER.DESC } });
    if (!alarmList){
      this.logger.warn(`Alarm not found`);
      throw new NotFoundException(`Alarm not found`);
    };
    return alarmList;
  };

  async getAlarmEntityById(alarmId: number): Promise<Alarm> {
    const filter = new FilteringAlarmDto();
    filter.id = alarmId;
    const alarm = await this.alarmRepository.getFilteredOne({ filter: filter });
    if (!alarm) {
      this.logger.warn(`Alarm not found : ${alarmId}`);
      throw new NotFoundException(`Alarm not found : ${alarmId}`);
    };
    return alarm;
  };

  async getAlarmById(alarmId: number): Promise<AlarmResponseDto> {
    const filter = new FilteringAlarmDto();
    filter.id = alarmId;
    const alarm = await this.alarmRepository.getFilteredOne({ filter: filter });
    if (!alarm) {
      this.logger.warn(`Alarm not found : ${alarmId}`);
      throw new NotFoundException(`Alarm not found : ${alarmId}`);
    };

    const responseDTO: AlarmResponseDto = plainToInstance(AlarmResponseDto, alarm, { excludeExtraneousValues: true });
    const fileList = await this.fileService.getFilesByIdList(alarm.file_id_list);
    responseDTO.fileList = fileList;
    return responseDTO;
  };


  // 알람 담당자 조회
  async getAlarmUsers(alarmId: number): Promise<CommonUserInfoDto[]> {
    const filter = new FilteringAlarmDto();
    filter.id = alarmId;
    const alarm = await this.alarmRepository.getFilteredOne({ filter: filter });
    if (!alarm) {
        this.logger.warn(`Alarm not found : ${alarmId}`);
        throw new NotFoundException(`Alarm not found : ${alarmId}`);
    };
    const userList = plainToInstance(AlarmResponseDto, alarm, { excludeExtraneousValues: true }).userList;
    return userList;
  };

  // 알람 담당자 추가
  async addAlarmUser(alarmId: number, userSeqId: number): Promise<ResponseStatusDto> {
    const filter = new FilteringAlarmDto();
    filter.id = alarmId;
    const alarm = await this.alarmRepository.getFilteredOne({ filter: filter });
    if (!alarm) {
      this.logger.warn(`Alarm not found : ${alarmId}`);
      throw new NotFoundException(`Alarm not found : ${alarmId}`);
    };
    const createRelationDto = new CreateAlarmUserRelationDto();
    createRelationDto.alarm_id = alarmId;
    createRelationDto.user_seq_id = userSeqId;
    const relationResult = await this.alarmUserRelationService.createAlarmUserRelation(createRelationDto);

    if (!relationResult) {
      this.logger.warn(`Failed to create alarmUserRelation : ${userSeqId}`);
      throw new InternalServerErrorException(`Failed to create alarmUserRelation : ${userSeqId}`);
    };

    let resStatusDto = new ResponseStatusDto();
    resStatusDto.isSuccess = true;
    return resStatusDto;
  };

  // 알람 담당자 삭제
  async deleteAlarmUser(alarmId: number, userSeqId: number): Promise<ResponseStatusDto> {
    const filter = new FilteringAlarmDto();
    filter.id = alarmId;
    const alarm = await this.alarmRepository.getFilteredOne({ filter: filter });
    if (!alarm) {
      this.logger.warn(`Alarm not found : ${alarmId}`);
      throw new NotFoundException(`Alarm not found : ${alarmId}`);
    };
    const resStatusDto = await this.alarmUserRelationService.deleteAlarmUserRelation(alarmId, userSeqId);
    return resStatusDto;
  };

  // 매뉴얼 파일 리스트 업로드
  async uploadFile(files: Multer.File[]): Promise<number[] | null> {
    let fileIdList: number[] = [];
      
    if (!files || files.length === 0) {
      this.logger.warn('No files uploaded');
      throw new BadRequestException('No files uploaded');
    };

    for (const file of files) {
      const fixedFileName = Buffer.from(file.originalname, 'latin1').toString('utf8');
      const fileData = {
        storedName : file.filename,
        name : fixedFileName,
        path : file.path,          
      };

      const createFileDto = plainToInstance(CreateFileDto, fileData, {excludeExtraneousValues: true});
      const newFile = await this.saveFile(createFileDto);

      fileIdList.push(newFile.id);
    };
    return fileIdList;
  };

  // 매뉴얼 파일 다운로드
  async getManual(alarmId: number, fileId: number): Promise<string> {
    const filter = new FilteringAlarmDto();
    filter.id = alarmId;
    const alarm = await this.alarmRepository.getFilteredOne({ filter: filter });
    if (!alarm) {
      this.logger.warn(`Alarm not found : ${alarmId}`);
      throw new NotFoundException(`Alarm not found : ${alarmId}`);
    };

    const findFile = await this.fileService.fildFileById(fileId);
    if (!findFile) {
      this.logger.warn(`File not found : ${fileId}`);
      throw new NotFoundException(`File not found : ${fileId}`);
    };

    const downloadFileDto = plainToInstance(DownloadFileDto, findFile, { excludeExtraneousValues: true });
    return await this.fileService.downloadFile(downloadFileDto);
  };

  // 매뉴얼 파일 삭제
  async deleteManual(alarmId: number, fileId: number): Promise<ResponseStatusDto> {
    const filter = new FilteringAlarmDto();
    filter.id = alarmId;
    const alarm = await this.alarmRepository.getFilteredOne({ filter: filter });
    if (!alarm) {
      this.logger.warn(`Alarm not found : ${alarmId}`);
      throw new NotFoundException(`Alarm not found : ${alarmId}`);
    };
    const deleteResult = await this.alarmRepository.deleteManualId(alarmId, fileId);
    if (!deleteResult) {
      this.logger.warn(`Failed to delete alarm manual ID`);
      throw new InternalServerErrorException(`Failed to delete alarm manual ID`);
    };
    const resStatusDto = await this.fileService.deleteFile(fileId);
    return resStatusDto;
  };

  // 알람 CSV 파일 일괄 등록
  async uploadAlarmCsv(file: Multer.File) {
    const alarms: Alarm[] = [];
  
    return new Promise<ResponseStatusDto>((resolve, reject) => {
      const stream = Readable.from(file.buffer);
      const promises: Promise<any>[] = [];
  
      stream
        .pipe(csv())
        .on('data', (row) => {
          const promise = this.saveAlarmsList(row) // saveAlarmsList 호출
            .then((newAlarm) => {
              alarms.push(newAlarm); // 성공적으로 저장된 알람 추가
            })
            .catch((error) => {
              this.logger.error('Error saving alarm', error.stack);
              reject(error); // 에러 발생 시 Promise 거부
            });
  
          promises.push(promise); // Promise<Alarm> 추가
        })
        .on('end', async () => {
          await Promise.all(promises); // 모든 비동기 작업이 완료될 때까지 대기
          let resStatusDto = new ResponseStatusDto();
          resStatusDto.isSuccess = true;
          resolve(resStatusDto); // 성공적으로 완료
        })
        .on('error', (error) => {
          reject(error); // stream 에러 처리
        });
    });
  };


  // 알람 CSV 파일 일괄 다운로드
  async downloadAlarmCsv(): Promise<any> {
    const filter = new FilteringAlarmDto();
    const alarms = await this.alarmRepository.getFilteredList({ filter: filter });
    if (!alarms) {
      this.logger.warn(`Alarm not found`);
      throw new NotFoundException(`Alarm not found`);
    };

    const flattenedAlarms = alarms.map((alarm) => ({
      id: alarm.id,
      code: alarm.code,
      type: alarm.type,
      description: alarm.description,
      importance: alarm.importance,
      create_date: dayjs(alarm.create_date).format('YYYY-MM-DD HH:mm:ss'),
      update_date: dayjs(alarm.update_date).format('YYYY-MM-DD HH:mm:ss'),
      process_method: alarm.process_method,
      send_enabled: alarm.send_enabled,
      valid_record: alarm.valid_record,
      equipment_type_name: alarm.equipment_type.name,
    }));
  
    const headers = [
      { id: 'id', title: 'id' },
      { id: 'code', title: 'code' },
      { id: 'type', title: 'type' },
      { id: 'description', title: 'description' },
      { id: 'importance', title: 'importance' },
      { id: 'create_date', title: 'create_date' },
      { id: 'update_date', title: 'update_date' },
      { id: 'process_method', title: 'process_method' },
      { id: 'file_id_list', title: 'file_id_list' },
      { id: 'send_enabled', title: 'send_enabled' },
      { id: 'valid_record', title: 'valid_record' },
      { id: 'equipment_type_name', title: 'equipment_type_name' },
    ];
    const csvStringifier = createObjectCsvStringifier({ header: headers });
    const bom = '\uFEFF';
    const csvContent = bom + csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(flattenedAlarms);
    return csvContent;
  };

  // 알람 삭제
  @Transactional()
  async softDeleteAlarmById(alarmIdList: number[]): Promise<ResponseStatusDto>{
    const result = await this.alarmRepository.softDeleteAlarmById(alarmIdList);
    if(!result) {
      this.logger.warn('Failed to delete');
      throw new NotFoundException(`Alarm with ID ${alarmIdList} not found`);
    };
    const isRelationDeleted = await this.alarmUserRelationService.deleteAlarmUserRelationByAlarmId(alarmIdList);
    return isRelationDeleted;
  };

  // CSV 파일의 개별 행을 처리하여 알람 저장
  private async saveAlarmsList(row: any): Promise<Alarm> {
    let equipmentType: EquipmentType;

    // Equipment type 없을 시 새로 생성
    try {
      equipmentType = await this.equipmentTypeService.getEquipmentTypeByName(row.equipmentTypeName);
    } catch (error) {
      if (error instanceof NotFoundException) {
        this.logger.warn(`EquipmentType not found : ${row.equipmentTypeName}`);
        const createEquipmentTypeDto = new CreateEquipmentTypeDto();
        createEquipmentTypeDto.name = row.equipmentTypeName;
        equipmentType = await this.equipmentTypeService.createEquipmentType(createEquipmentTypeDto);
      } else {
        throw error;
      }
    }

    // 담당자 지정
    const userIdList = row.userIdList.split(',').map(id => String(id.trim()));
    let userSeqIdList: number[] = [];
    if (row.userIdList && row.userIdList.trim() !== '') {
      for (const userId of userIdList) {
        try {
          const user = await this.usersService.findUsersEntityByUserId(userId);
          if (user) {
            userSeqIdList.push(user.seq_id);
          } else {
            this.logger.warn(`User not found : ${userId}`);
          }
        } catch (error) {
          this.logger.warn(`User not found : ${userId}`);
        }
      }
    }
    row.userSeqIdList = userSeqIdList;
    const createAlarmDto = plainToInstance(CreateAlarmDto, row, { enableImplicitConversion: true });
    const newAlarm = await this.alarmRepository.createAlarm(equipmentType, createAlarmDto);
  
    for (const userSeqId of createAlarmDto.user_seq_id_list ?? []) {
      const createRelationDto = new CreateAlarmUserRelationDto();
      createRelationDto.alarm_id = newAlarm.id;
      createRelationDto.user_seq_id = userSeqId;
      await this.alarmUserRelationService.createAlarmUserRelation(createRelationDto);
    };
    return newAlarm;
  };

  // 파일 테이블에 파일 저장
  private async saveFile(createFileDto: CreateFileDto): Promise<FileResponseDto> {
    const newFile = await this.fileService.createFile(createFileDto);
    return newFile;
  };

  async checkCode(codeName: string, equipmentTypeId: number): Promise<boolean>{
    const filter = new FilteringAlarmDto();
    filter.code = codeName;
    filter.equipmentTypeId = equipmentTypeId;
    const result = await this.alarmRepository.getFilteredList({ filter: filter, joinUsers: false });
    return result.length > 0;
  };
};