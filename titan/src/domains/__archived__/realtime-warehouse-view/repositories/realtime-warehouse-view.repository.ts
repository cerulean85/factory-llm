import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RealtimeWarehouseView } from '../entities/realtime-warehouse-view.entity';
import { CreateRealtimeWarehouseViewDto } from '../dto/request/create-realtime-warehouse-view.dto';
import { UpdateRealtimeWarehouseViewDto } from '../dto/request/update-realtime-warehouse-view.dto';
import { Warehouse } from 'src/domains/storage/warehouse/entities/warehouse.entity';
import { RealtimeWarehouseViewBaseRepository } from './realtime-warehouse-view.base.repository';
import { Pagination } from 'src/utils/pagination.util';


@Injectable()
export class RealtimeWarehouseViewRepository extends RealtimeWarehouseViewBaseRepository {
  constructor(
    @InjectRepository(RealtimeWarehouseView)
    repository: Repository<RealtimeWarehouseView>,
    pagination: Pagination
  ) {super(repository, pagination);}

  async createRealtimeWarehouseView(warehouse?: Warehouse, dto?: CreateRealtimeWarehouseViewDto): Promise<RealtimeWarehouseView> {
    const newView = this.repository.create({
      warehouse: warehouse,
      ...dto,
    });
    const result = await this.repository.save(newView);
    return result;
  }

  async updateRealtimeWarehouseView(view: RealtimeWarehouseView, warehouse?: Warehouse, dto?: UpdateRealtimeWarehouseViewDto): Promise<boolean> {
    this.repository.merge(view, {
      warehouse: warehouse,
      ...dto,
    });
    const result = await this.repository.save(view)
    return result ? true : false;
  }
};