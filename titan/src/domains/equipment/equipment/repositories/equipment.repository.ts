import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Equipment } from '../entities/equipment.entity';
import { CreateEquipmentDto } from '../dto/request/create-equipment.dto';
import { EquipmentBaseRepository } from './equipment.base.repository';
import { Pagination } from 'src/utils/pagination.util';
import { EquipmentType } from '../../equipment-type/entities/equipment-type.entity';
import { Warehouse } from 'src/domains/storage/warehouse/entities/warehouse.entity';

@Injectable()
export class EquipmentRepository extends EquipmentBaseRepository {
  constructor(
    @InjectRepository(Equipment)
    repository: Repository<Equipment>,
    pagination: Pagination,
  ) {super(repository, pagination)}

  async createEquipment(equipmentType: EquipmentType, warehouse: Warehouse, createEquipmentDto: CreateEquipmentDto): Promise<Equipment> {
    const newEquipment = this.repository.create({
      equipment_type: equipmentType,
      warehouse: warehouse,
      ...createEquipmentDto,
    });
    return await this.repository.save(newEquipment);
  }

  async softDeleteEquipmentById(equipmentId: number): Promise<boolean> {
    const result = await this.repository.update(
      { id: equipmentId },
      { valid_record: false }
    );
    return result.affected !== undefined && result.affected > 0;
  }
}