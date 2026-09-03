import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShippingSpecification } from '../entities/shipping-specification.entity';
import { CreateShippingSpecificationDto } from '../dto/request/create-shipping-specification.dto';
import { Users } from 'src/domains/users/users/entities/users.entity';
import { UpdateShippingSpecificationDto } from '../dto/request/update-shipping-specification.dto';
import { ShippingSpecificationBaseRepository } from './shipping-specification.base.repository';
import { Pagination } from 'src/utils/pagination.util';

@Injectable()
export class ShippingSpecificationRepository extends ShippingSpecificationBaseRepository {
  constructor(
    @InjectRepository(ShippingSpecification)
    repository: Repository<ShippingSpecification>,
    pagination: Pagination,
  ) {super(repository, pagination);}

  async createShippingSpecification(createShippingSpecificationDto : CreateShippingSpecificationDto, users: Users): Promise<ShippingSpecification> {
    const shippingSpecification = this.repository.create({
      users: users,
      ...createShippingSpecificationDto,
    });
    return await this.repository.save(shippingSpecification);
  }

  async updateShippingSpecification(shippingSpecification: ShippingSpecification, users?: Users, updateShippingSpecificationDto?: UpdateShippingSpecificationDto): Promise<boolean> {
    this.repository.merge(shippingSpecification, {
      users: users,
      update_date: new Date(),
      ...updateShippingSpecificationDto
    });
    const result = await this.repository.save(shippingSpecification);    
    return result ? true : false;
  }

  async softDeleteShippingSpecificationById(shippingSpecificationId: number): Promise<boolean> {
    const result = await this.repository.update(
      { id: shippingSpecificationId },
      { valid_record: false }
    );
    return result.affected !== undefined && result.affected > 0;
  }
}
