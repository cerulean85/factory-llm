import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StoredItem } from '../entities/stored-item.entity';
import { UpdateStoredItemDto } from '../dto/update-stored-item.dto';
import { CreateStoredItemDto } from '../dto/create-stored-item.dto';
import { StoredItemBaseRepository } from './stored-item.base.repository';
import { Pagination } from 'src/utils/pagination.util';


@Injectable()
export class StoredItemRepository extends StoredItemBaseRepository {
  constructor(
    @InjectRepository(StoredItem)
    repository: Repository<StoredItem>,
    pagination: Pagination,
  ) {super(repository, pagination);}

  async createStoredItem(dto: CreateStoredItemDto): Promise<StoredItem>{
    const newItem = this.repository.create(dto);
    const result = await this.repository.save(newItem);
    return result;
  }

  async updateStoredItem(storedItemId: number, dto: UpdateStoredItemDto): Promise<boolean> {
    const storedItem = await this.repository.findOne({
      where: { id: storedItemId },
    });
    if (!storedItem) throw new NotFoundException('StoredItem not found');

    this.repository.merge(storedItem, {
      update_date: new Date(),
      ...dto
    });

    const result = await this.repository.save(storedItem);
    return !!result;
  }
}