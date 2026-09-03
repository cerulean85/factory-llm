import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Filter, Repository, SelectQueryBuilder } from 'typeorm';

import { Users } from 'src/domains/users/users/entities/users.entity';

import { Pagination } from 'src/utils/pagination.util';
import { PaginationRequestDto } from 'src/common/dto/pagination-request.dto';
import { PaginationResponseDto } from 'src/common/dto/pagination-response.dto';
import { Todo } from '../entities/todo.entity';
import { CreateTodoDto } from '../dto/request/create-todo.dto';
import { UpdateTodoDto } from '../dto/request/update-todo.dto';
import { FilteringTodoDto } from '../dto/request/filtering-todo.dto';
import { ORDER } from 'src/common/enum/db.enum';
import { TodoBaseRepository } from './todo.base.repository';


@Injectable()
export class TodoRepository extends TodoBaseRepository {
  constructor(
    @InjectRepository(Todo)
    repository: Repository<Todo>,
    pagination: Pagination,
  ) { super(repository, pagination); }

  async createTodo(users?: Users, createTodoDto?: CreateTodoDto): Promise<Todo> {
    const newTodo = this.repository.create({
      users: users,
      ...createTodoDto});
    return await this.repository.save(newTodo);
  }

  async updateTodo(todo: Todo, user?: Users, updateTodoDto?: UpdateTodoDto): Promise<boolean> {
    this.repository.merge(todo, {
      update_date: new Date(),
      users: user,
      ...updateTodoDto
    });
    const result = await this.repository.save(todo);
    
    return result ? true : false;
  }

  async softDeleteTodoById(todoId: number): Promise<boolean> {
    const result = await this.repository.update(
      { id: todoId },
      { valid_record: false}
    );
    return result.affected !== undefined && result.affected > 0;
  }

}