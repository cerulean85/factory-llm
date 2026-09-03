import { Controller, Post, Body, Get, Param, Query, ParseIntPipe, Delete, UseGuards, Put } from '@nestjs/common';


import { plainToInstance } from 'class-transformer';
import { JwtServiceAuthGuard } from '../../core/auth/jwt/jwt-service.guard';
import { ResponseStatusDto } from 'src/common/dto/response-status.dto';

import { Pagination } from 'src/utils/pagination.util';
// import { ReturnDto } from 'src/common/decorator/return-dto.decorator';
import { ApiBody, ApiParam, ApiQuery } from '@nestjs/swagger';
import { ApiPaginatedReturn } from 'src/common/decorator/api-paginated-return.decorator';
import { ApiReturn } from 'src/common/decorator/api-return.decorator';
import { TodoService } from './todo.service';
import { TodoResponseDto } from './dto/response/todo-response.dto';
import { FilteringTodoDto } from './dto/request/filtering-todo.dto';
import { CreateTodoDto } from './dto/request/create-todo.dto';
import { UpdateTodoDto } from './dto/request/update-todo.dto';
import { AttainmentTodoDto } from './dto/response/attainment-todo.dto';

@Controller('todo')
export class TodoController {
  constructor(
    private readonly todoService: TodoService,
  ) {}

  //#region GET (POST)
  //모든 할 일 조회
  @Post('get-all')
  @UseGuards(JwtServiceAuthGuard)
  @ApiBody({ type : FilteringTodoDto })
  @ApiPaginatedReturn(TodoResponseDto, "모든 할 일 조회", "등록된 모든 할 일 조회", "모든 할 일" )
  async getAllTodo(
    @Body() filteringTodoDto: FilteringTodoDto,
  ) {
    const findedData = await this.todoService.getAll(filteringTodoDto);
    const result = Pagination.transformPaginatedData(TodoResponseDto, filteringTodoDto, findedData);
    return result;
  };

  //(달성률을 포함한) 특정 할 일 조회
  @Post('get/:todoId')
  @UseGuards(JwtServiceAuthGuard)
  @ApiParam({ name: 'todoId', type: Number, description: '할 일 ID' })
  @ApiReturn(TodoResponseDto, "특정 할 일 조회", "특정 할 일 조회", "특정 할 일" )
  async geTodoById(
    @Param('todoId') todoId: number
  ): Promise<TodoResponseDto>{
    const findedData = await this.todoService.findTodoById(todoId);
    const result = plainToInstance(TodoResponseDto, findedData, { excludeExtraneousValues: true });
    return result;
  };


  //달성률을 포함한 모든 할 일 조회
  @Post('get-all-with-attainment')
  @UseGuards(JwtServiceAuthGuard)
  @ApiPaginatedReturn(AttainmentTodoDto, "모든 (달성률)할 일 조회", "등록된 모든 (달성률)할 일 조회", "모든 (달성률)할 일" )
  async getAllWithAttainment(
    @Body() filteringTodoDto: FilteringTodoDto,
  ) {
    const findedData = await this.todoService.getAllTodoWithAttainment(filteringTodoDto);
    const result = Pagination.transformPaginatedData(AttainmentTodoDto, filteringTodoDto, findedData);
    return result;
  };

  //#endregion

  //#region POST
  //할 일 생성
  @Post('create')
  @UseGuards(JwtServiceAuthGuard)
  @ApiBody({ type : CreateTodoDto })
  @ApiReturn(TodoResponseDto, "할 일 등록", "할 일 등록", "할 일" )
  async createTodo(
    @Body() createTodoDto: CreateTodoDto
  ): Promise<TodoResponseDto>{
    const createdData = await this.todoService.createTodo(createTodoDto);
    const result = plainToInstance(TodoResponseDto, createdData, { excludeExtraneousValues: true });
    return result;
  };
  //#endregion

  // #region PATCH
  //할 일 업데이트
  @Put('update/:todoId')
  @UseGuards(JwtServiceAuthGuard)
  @ApiParam({ name: 'todoId', type: Number, description: '할 일 ID' })
  @ApiBody({ type : UpdateTodoDto })
  @ApiReturn(ResponseStatusDto, "할 일 수정", "할 일 수정", "할 일 수정" )
  async updateTodo(
    @Param('todoId', ParseIntPipe) todoId: number,
    @Body() updateTodoDto: UpdateTodoDto
  ): Promise<ResponseStatusDto>{
      const result = await this.todoService.updateTodo(todoId, updateTodoDto);
      return result;
  };
  // #endregion

  // #region DELETE
  //할 일 삭제
  @Delete('delete/:todoId/soft')
  @UseGuards(JwtServiceAuthGuard)
  @ApiParam({ name: 'todoId', type: Number, description: '할 일 ID' })
  @ApiReturn(ResponseStatusDto, "할 일 삭제", "할 일 삭제", "할 일 삭제" )
  async softDeleteTodo(
    @Param('todoId', ParseIntPipe) todoId: number,
  ): Promise<ResponseStatusDto>{
    const result = await this.todoService.softDeleteTodoById(todoId);
    const resStatusDto = new ResponseStatusDto();
    resStatusDto.isSuccess = result;
    return resStatusDto
  };
  // #endregion
}