import { Injectable, Type } from '@nestjs/common';
import { ObjectLiteral, Repository, SelectQueryBuilder } from 'typeorm';
import { PaginationRequestDto } from 'src/common/dto/pagination-request.dto';
import { PaginationResponseDto } from 'src/common/dto/pagination-response.dto';
import { ClassConstructor, plainToInstance } from 'class-transformer';
export interface FilteringPaginatedDtoClass<T> extends Type<PaginationResponseDto<T>> {
  TargetDto: Type<T>;
}


@Injectable()
export class Pagination {
  //Find를 사용했을 떄의 페이지네이션 처리
  async paginateWithRepository<T extends ObjectLiteral>(
    repository: Repository<T>, 
    paginationRequestDto: PaginationRequestDto,
    whereCondition: any = {},
    relations: string[] = []
  ): Promise<PaginationResponseDto<T>> {
    const { page, limit } = paginationRequestDto;

    let total: number;
    let data: T[];

    [data, total] = await repository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      where: whereCondition,
      relations: relations,
    });

    return new PaginationResponseDto(data, total, limit, page);
  }

  //쿼리 빌더를 사용했을 때의 페이지네이션 처리
  async paginateWithQueryBuilder<T extends ObjectLiteral>(
    QueryBuilder: SelectQueryBuilder<T>, 
    paginationRequestDto: PaginationRequestDto,
  ): Promise<PaginationResponseDto<T>> {
    const { page, limit } = paginationRequestDto;

    let total: number;
    let data: T[];
    
    const queryBuilder = QueryBuilder as SelectQueryBuilder<T>;
    total = await queryBuilder.getCount();
    data = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    return new PaginationResponseDto(data, total, limit, page);
  }


  //쿼리 빌더를 사용했을 때의 페이지네이션 처리 (raw data 포함)  
  //명시적으로 Alias를 지정해야 한다.
  async paginateRawWithQueryBuilder<T extends ObjectLiteral>(
    QueryBuilder: SelectQueryBuilder<T>, 
    paginationRequestDto: PaginationRequestDto,
  ): Promise<PaginationResponseDto<any>> {
    const { page, limit } = paginationRequestDto;
  
    const total = await QueryBuilder.getCount();
    const paginatedQuery = QueryBuilder
      .skip((page - 1) * limit)
      .take(limit);
  
    const { raw, entities } = await paginatedQuery.getRawAndEntities();
  
    /*
    // raw와 entity를 조합하여 DTO에 매핑
    const data = entities.map((entity, index) => ({
      ...entity,
      ...raw[index],
    }));
    */

    return new PaginationResponseDto(raw, total, limit, page);
  }

  //pagination data의 형을 바꿔준다. 
  static transformPaginatedData<O, T>(
      targetStructure : ClassConstructor<T>,  //바꿀 형 (plainToInstance)
      paginationRequest : PaginationRequestDto, //페이지네이션 요청 객체
      paginationResponse : PaginationResponseDto<O>,  //페이지네이션 응답 객체 (원본)
  ) : PaginationResponseDto<T>
  {
    const transformedData = plainToInstance(targetStructure, paginationResponse.data 
      , {excludeExtraneousValues: true});
    return new PaginationResponseDto(transformedData
      , paginationResponse.total
      , paginationRequest.limit
      , paginationRequest.page);
  }

  //Global Filter를 사용하기 위한 페이지네이션 DTO 생성
  static createFilteringPaginatedDto<T>(TargetDto: Type<T>): FilteringPaginatedDtoClass<T> {
    class PaginatedDto extends PaginationResponseDto<T> {}
    (PaginatedDto as FilteringPaginatedDtoClass<T>).TargetDto = TargetDto;
    return PaginatedDto as FilteringPaginatedDtoClass<T>;
  }
  
}