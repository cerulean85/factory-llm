import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { ORDER } from 'src/common/enum/db.enum';
import { BaseRepositoryContract } from 'src/common/repository/base-repository-contract';
import { Pagination } from 'src/utils/pagination.util';
import { Todo } from '../entities/todo.entity';
import { FilteringTodoDto } from '../dto/request/filtering-todo.dto';



export interface ITodoQueryOptions{
  filter? : FilteringTodoDto;
  joinUsers?: boolean;
  orderMap?: Partial<Record<TodoOrderKey, ORDER>>;
}

export enum TodoOrderKey{
  ID = 'todo.id',
  CREATE_DATE = 'todo.create_date'
}


@Injectable()
export abstract class TodoBaseRepository extends BaseRepositoryContract<Todo, ITodoQueryOptions> {
  constructor(
    @InjectRepository(Todo)
    protected readonly repository: Repository<Todo>,
    protected readonly pagination: Pagination
  ) {super(repository, pagination);}
  
  protected initializeDefaultOptions(
    options: ITodoQueryOptions= {}
  ): Required<ITodoQueryOptions> {
    return {
      filter: options.filter ?? new FilteringTodoDto(),
      joinUsers: options.joinUsers ?? true,
      orderMap: options.orderMap ?? {},
    };
  }
  
  protected createQueryBuilder(
    options: ITodoQueryOptions
  ): SelectQueryBuilder<Todo>
  {
    const {filter, joinUsers, orderMap } = this.initializeDefaultOptions(options);
    const queryBuilder = this.createJoinQueryBuilder(joinUsers);
    const filteredQb = this.makeFilteredQueryBuilder(queryBuilder, filter);
    const orderedQb = this.makeOrderedQueryBuilder(filteredQb, orderMap );
    return orderedQb;
  }

  
  protected makeFilteredQueryBuilder(
    queryBuilder: SelectQueryBuilder<Todo>,
    filter: FilteringTodoDto 
  ): SelectQueryBuilder<Todo> {
    if (filter.todoId) {
      queryBuilder.andWhere('todo.id = :id', { id: filter.todoId });
    }
    if(filter.alarmProcessFlag !== undefined && filter.alarmProcessFlag !== null){
      queryBuilder.andWhere('todo.alarm_process_flag = :alarmProcessFlag', { alarmProcessFlag: filter.alarmProcessFlag });
    }

    if (filter.targetStartDate) {
      queryBuilder.andWhere('todo.target_start_date >= :startDate', {
        startDate: filter.targetStartDate,
      });
    }

    if (filter.targetEndDate) {
      queryBuilder.andWhere('todo.target_end_date <= :endDate', {
        endDate: filter.targetEndDate,
      });
    }

    return queryBuilder;
  }

  protected createJoinQueryBuilder(joinUsers: boolean = true): SelectQueryBuilder<Todo> {
    const queryBuilder = this.repository.createQueryBuilder('todo')

    if (joinUsers) {
      queryBuilder
      .leftJoinAndSelect('todo.users', 'users')
    };
    
    queryBuilder
    .select([
      'todo.id',
      'todo.target_start_date',
      'todo.target_end_date',
      'todo.standard_type',
      'todo.target_count',
      'todo.description',
      'todo.create_date',
      'todo.update_date',
      'todo.alarm_offset_hours',
      'todo.alarm_process_flag',

      ...(joinUsers ? [
        'users.seq_id',
        'users.user_id',
        'users.name',
        'users.email'
      ] : []),
    ]);

    queryBuilder
    .where('todo.valid_record = :validRecord', {validRecord: true})
    // .orderBy('todo.id', 'ASC');

    return queryBuilder;
  }
}