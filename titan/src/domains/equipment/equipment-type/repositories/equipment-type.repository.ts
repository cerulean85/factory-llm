import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { EquipmentType } from '../entities/equipment-type.entity';
import { CreateEquipmentTypeDto } from '../dto/request/create-equipment-type.dto';
import { ORDER } from 'src/common/enum/db.enum';
import { FilteringEquipmentTypeDto } from '../dto/request/filtering-equipment-type.dto';
import { Pagination } from 'src/utils/pagination.util';
import { EquipmentTypeBaseRepository } from './equipment-type.base.repository';

interface IEquipmentTypeQueryOptions {
  filter?: FilteringEquipmentTypeDto;
  orderById?: ORDER;
}

@Injectable()
export class EquipmentTypeRepository extends EquipmentTypeBaseRepository{
  constructor(
    @InjectRepository(EquipmentType)
    repository: Repository<EquipmentType>,
    pagination: Pagination
  ) {super(repository, pagination)}
  async createEquipmentType(createEquipmentTypeDto: CreateEquipmentTypeDto): Promise<EquipmentType> {
    const newEquipmentType = this.repository.create(createEquipmentTypeDto);
    return await this.repository.save(newEquipmentType);
  }

  async softDeleteEquipmentTypeById(id: number): Promise<boolean> {
    const result = await this.repository.update( id, { valid_record: false});
    return result.affected !== undefined && result.affected > 0;
  }
}