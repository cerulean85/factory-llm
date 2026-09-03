import { Injectable, Type } from '@nestjs/common';
import { LessThan, ObjectLiteral, Repository, SelectQueryBuilder } from 'typeorm';
import { CursorRequestDto } from 'src/common/dto/cursor-request.dto';

import { ClassConstructor, plainToInstance } from 'class-transformer';
import { CursorResponseDto } from 'src/common/dto/cursor-response.dto';

export interface FilteringCursorDtoClass<T> extends Type<CursorResponseDto<T>> {
  TargetDto: Type<T>;
}


@Injectable()
export class Cursor {

  //쿼리 빌더를 사용했을 때의 페이지네이션 처리
  async CursorWithQueryBuilder<T extends ObjectLiteral>(
    QueryBuilder: SelectQueryBuilder<T>, 
    cursorRequestDto: CursorRequestDto,
    cursorColumn: string = 'seq_id',
    order: 'ASC' | 'DESC' = 'ASC',
  ): Promise<CursorResponseDto<T>> {
    const { cursor, limit } = cursorRequestDto;

    const queryBuilder = QueryBuilder.take(limit);

    if (cursor) {
      if (order === 'ASC') {
        queryBuilder.andWhere(`${cursorColumn} > :cursor`, { cursor });
      } else {
        queryBuilder.andWhere(`${cursorColumn} < :cursor`, { cursor });
      }
    }
    const [data, total] = await queryBuilder.getManyAndCount();
    const nextCursor = data.length > 0 ? data[data.length - 1][cursorColumn.split('.').pop()!] : null;

    return new CursorResponseDto(data, total, nextCursor, data.length === limit);
  }

  //pagination data의 형을 바꿔준다. 
  static transformCursorData<O, T>(
    targetStructure : ClassConstructor<T>,  //바꿀 형 (plainToInstance)
    cursorRequest : CursorRequestDto, // 요청 객체
    cursorResponse : CursorResponseDto<O>,  // 응답 객체 (원본)
  ) : CursorResponseDto<T>
  {
    const transformedData = plainToInstance(targetStructure, cursorResponse.data 
      , {excludeExtraneousValues: true});
    return new CursorResponseDto(
      transformedData
      , cursorResponse.total
      , cursorResponse.cursor
      , cursorResponse.hasMore);
  }

  //Global Filter를 사용하기 위한 커서 DTO 생성
  static createFilteringCursorDto<T>(TargetDto: Type<T>): FilteringCursorDtoClass<T> {
    class CursorDto extends CursorResponseDto<T> {}
    (CursorDto as FilteringCursorDtoClass<T>).TargetDto = TargetDto;
    return CursorDto as FilteringCursorDtoClass<T>;
  }
}