import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { ShippingSpecification } from '../entities/shipping-specification.entity';
import { FilteringShippingSpecificationDto } from '../dto/request/filtering-shipping-specification.dto';
import { ORDER } from 'src/common/enum/db.enum';
import { BaseRepositoryContract } from 'src/common/repository/base-repository-contract';
import { Pagination } from 'src/utils/pagination.util';

export interface IShippingSpecificationQueryOptions {
  filter?: FilteringShippingSpecificationDto;
  joinUsers?: boolean;
  orderMap?: Partial<Record<ShippingSpecificationOrderKey, ORDER>>;
}

export enum ShippingSpecificationOrderKey {
  ID = 'shipping_specification.id',
  CREATE_DATE = 'shipping_specification.create_date',
}

@Injectable()
export abstract class ShippingSpecificationBaseRepository extends BaseRepositoryContract<ShippingSpecification, IShippingSpecificationQueryOptions> {
  constructor(
    @InjectRepository(ShippingSpecification)
    protected readonly repository: Repository<ShippingSpecification>,
    protected readonly pagination: Pagination,
  ) {super(repository, pagination);}

  protected initializeDefaultOptions(
    options: IShippingSpecificationQueryOptions = {}
  ): Required<IShippingSpecificationQueryOptions> {
    return {
      filter: options.filter ?? new FilteringShippingSpecificationDto(),
      joinUsers: options.joinUsers ?? true,
      orderMap: options.orderMap ?? {},
    };
  }

  protected createQueryBuilder(
    options: IShippingSpecificationQueryOptions
  ): SelectQueryBuilder<ShippingSpecification> {
    const {filter, joinUsers, orderMap } = this.initializeDefaultOptions(options);
    const queryBuilder = this.createJoinQueryBuilder(joinUsers);
    const filteredQb = this.makeFilteredQueryBuilder(queryBuilder, filter);
    const orderedQb = this.makeOrderedQueryBuilder(filteredQb, orderMap);

    return orderedQb;
  }

  protected makeFilteredQueryBuilder(
    queryBuilder: SelectQueryBuilder<ShippingSpecification>,
    filter: FilteringShippingSpecificationDto
  ): SelectQueryBuilder<ShippingSpecification> {
    if (filter.shippingSpecificationId) {
      queryBuilder.andWhere('shipping_specification.id = :id', { id: filter.shippingSpecificationId });
    }
    
    return queryBuilder;
  }

  protected createJoinQueryBuilder(joinUsers: boolean = true): SelectQueryBuilder<ShippingSpecification> {
    const queryBuilder = this.repository.createQueryBuilder('shipping_specification')
    if (joinUsers) {
      queryBuilder
      .leftJoinAndSelect('shipping_specification.users', 'users')
    };

    queryBuilder
    .select([
      'shipping_specification.id',
      'shipping_specification.create_date',
      'shipping_specification.update_date',
      'shipping_specification.valid_record',
      'shipping_specification.standard_type',

      ...(joinUsers ? [
        'users.seq_id',
        'users.user_id',
        'users.name',
      ] : []),
    ]);

    queryBuilder
    .where('shipping_specification.valid_record = :validRecord', {validRecord: true});

    return queryBuilder;
  }
}
