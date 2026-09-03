import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository, SelectQueryBuilder  } from 'typeorm';
import { Alarm } from '../entities/alarm.entity';
import { CreateAlarmDto } from '../dto/request/create-alarm.dto';
import { UpdateAlarmDto } from '../dto/request/update-alarm.dto';
import { Pagination } from 'src/utils/pagination.util';
import { FilteringAlarmDto } from '../dto/request/filtering-alarm.dto';
import { In } from 'typeorm';
import { ORDER } from 'src/common/enum/db.enum';
import { AlarmBaseRepository } from './alarm.base.repository';
import { EquipmentType } from 'src/domains/equipment/equipment-type/entities/equipment-type.entity';

interface IAlarmQueryOptions {
  filter?: FilteringAlarmDto;
  joinUsers?: boolean;
  joinEquipmentType?: boolean;
  orderById?: ORDER;
}

@Injectable()
export class AlarmRepository extends AlarmBaseRepository {
  constructor(
    @InjectRepository(Alarm)
    repository: Repository<Alarm>,
    pagination : Pagination
  ) {super(repository, pagination)}


  async createAlarm(equipmentType: EquipmentType, createAlarmDto: CreateAlarmDto): Promise<Alarm> {
    const newAlarm = this.repository.create({
      equipment_type: equipmentType,
      ...createAlarmDto});

    return await this.repository.save(newAlarm);
  }

  async updateAlarm(alarm: Alarm, equipmentType?: EquipmentType, updateAlarmDto?: UpdateAlarmDto): Promise<boolean> {

    this.repository.merge(alarm, {
      equipment_type: equipmentType,
      update_date: new Date(),
      ...updateAlarmDto
    });

    if (updateAlarmDto && updateAlarmDto.file_id_list && updateAlarmDto.file_id_list.length > 0) {
      const existingFileIds = alarm.file_id_list || [];
      const updatedFileIds = [...new Set([...existingFileIds, ...updateAlarmDto.file_id_list])];
      await this.repository.update(alarm.id, { file_id_list: updatedFileIds });
    }

    const result = await this.repository.save(alarm);
    return result ? true : false;
  }

  async deleteManualId(alarmId: number, fileId: number): Promise<boolean> {
    const alarm = await this.repository.findOne({ where: { id: alarmId } });
    const newManualId = alarm?.file_id_list.filter(id => id !== fileId)
    const result = await this.repository.update({ id: alarmId }, { file_id_list: newManualId });
    return result.affected !== undefined && result.affected > 0;
  }

  async softDeleteAlarmById(alarmIdList: number[]): Promise<boolean> {
    const result = await this.repository.update(
      { id: In(alarmIdList) },
      { valid_record: false }
    );
    return result.affected !== undefined && result.affected > 0;
  }

  async getFileList(fileIdList: number[]): Promise<any[]> {

    const queryBuilder = this.repository.createQueryBuilder('alarm')
      .select('alarm.file_id_list')
      .where('alarm.file_id_list && :fileIdList', { fileIdList })
      .getMany();

    return queryBuilder;
  }
}