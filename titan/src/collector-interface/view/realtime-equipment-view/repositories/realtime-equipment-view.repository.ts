import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RealtimeEquipmentView } from '../entities/realtime-equipment-view.entity';
import { Equipment } from 'src/domains/equipment/equipment/entities/equipment.entity';
import { CreateRealtimeEquipmentViewDto } from '../dto/request/create-realtime-equipment-view.dto';
import { RealtimeEquipmentViewBaseRepository } from './realtime-equipment-view.base.repository';
import { Pagination } from 'src/utils/pagination.util';

@Injectable()
export class RealtimeEquipmentViewRepository extends RealtimeEquipmentViewBaseRepository {
  constructor(
    @InjectRepository(RealtimeEquipmentView)
    repository: Repository<RealtimeEquipmentView>,
    pagination: Pagination
  ) {super(repository, pagination);}

  async createRealtimeEquipmentView(equipment?: Equipment, createDto?: CreateRealtimeEquipmentViewDto): Promise<RealtimeEquipmentView> {
    const newRealtimeEquipmentView = this.repository.create({
      equipment: equipment,
      ...createDto
    });
    return await this.repository.save(newRealtimeEquipmentView);
  }
}