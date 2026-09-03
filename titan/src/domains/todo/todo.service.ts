import { Logger, Injectable, NotFoundException,  InternalServerErrorException, forwardRef, Inject } from '@nestjs/common';

import { UsersService } from '../users/users/users.service';
import { PaginationRequestDto } from 'src/common/dto/pagination-request.dto';
import { TodoRepository } from './repositories/todo.repository';
import { CreateTodoDto } from './dto/request/create-todo.dto';
import { UpdateTodoDto } from './dto/request/update-todo.dto';
import { Todo } from './entities/todo.entity';
import { FilteringTodoDto } from './dto/request/filtering-todo.dto';
import { SseService } from 'src/core/sse/sse.service';
import { DEBUG_TODO_SEARCH } from 'src/config/debug.config';
import { FilteringDateDto } from 'src/common/dto/filtering-date.dto';
import { MailRequestDto } from 'src/core/mail/dto/mail-request.dto';
import { MailService } from 'src/core/mail/mail.service';
import { Users } from '../users/users/entities/users.entity';
import { ResponseStatusDto } from 'src/common/dto/response-status.dto';
import { ORDER } from 'src/common/enum/db.enum';
import { TodoOrderKey } from './repositories/todo.base.repository';
import { GantryJobHistoryService } from '../storage/job-history/gantry-job-history.service';
import { FilteringJobHistoryDto } from '../storage/job-history/dto/request/filtering-job-history.dto';
import { InitEndOfDay, InitStartOfDay } from 'src/utils/date-transform.util';
import { EQUIPMENT_TYPE, TASK_TYPE, WAREHOUSE_TYPE } from 'src/common/enum/equipment.enum';
import { SSE_EVENT_TYPE } from 'src/common/enum/sse.enum';

@Injectable()
export class TodoService {
    private readonly logger = new Logger(TodoService.name)
    private isRunning = false;
    constructor(
    private readonly todoRepository: TodoRepository,
    private readonly usersService: UsersService,
    private readonly gantryJobHistoryService: GantryJobHistoryService,
    private readonly sseService: SseService,
    private readonly mailService: MailService,
  ) {}

  onModuleInit() {
    if (DEBUG_TODO_SEARCH) {
      this.scheduleTask();
    }
  }

  async createTodo(createTodoDto: CreateTodoDto) : Promise<Todo> {
    const { users_seq_id: usersSeqId } = createTodoDto;
    const users = await this.usersService.findUsersEntityBySeqId(usersSeqId) ?? undefined;
    const newTodo = await this.todoRepository.createTodo(users, createTodoDto);
    return newTodo;
  };

  async updateTodo(todoId: number, updateTodoDto: UpdateTodoDto): Promise<ResponseStatusDto> {
    let user: Users | undefined = undefined;
    const filterDto = new FilteringTodoDto();
    filterDto.todoId = todoId;
    const todo = await this.todoRepository.getFilteredOne({filter : filterDto});
    if (!todo) {
      this.logger.warn(`Todo with ID ${todoId} not found`);
      throw new NotFoundException(`Todo with ID ${todoId} not found`);
    };
    if (updateTodoDto.users_seq_id) {
      user = await this.usersService.findUsersEntityBySeqId(updateTodoDto.users_seq_id) ?? undefined;
    }
    const result = await this.todoRepository.updateTodo(todo, user, updateTodoDto);

    if (!result) {
      this.logger.warn(`Failed to update noti with ID ${todoId}`);
      throw new InternalServerErrorException(`Failed to update noti with ID ${todoId}`);
    };
    let resStatusDto = new ResponseStatusDto();
    resStatusDto.isSuccess = result;
    resStatusDto.message = result ? 'Todo updated successfully' : 'Failed to update todo';
    return resStatusDto;
  };

  async getAll(paginationRequest: PaginationRequestDto) {
    const pageRes = await this.todoRepository.getFilteredPaginatedList({filter : paginationRequest as FilteringTodoDto});//await this.todoRepository.getAllTodo(filterDto);
    return pageRes;
  };

  async findTodoById(todoId: number): Promise<Todo> {
    const filterDto = new FilteringTodoDto();
    filterDto.todoId = todoId;
    const todo = await this.todoRepository.getFilteredOne({filter : filterDto});
    if (!todo) {
      this.logger.warn(`Todo not found : ${todoId}`);
      throw new NotFoundException(`Todo not found : ${todoId}`);
    };
    return todo;
  };

  async getAllTodoWithAttainment(filteringRequest: FilteringTodoDto) {
    const pageRes = await this.todoRepository.getFilteredPaginatedList({filter : filteringRequest, orderMap: { [TodoOrderKey.CREATE_DATE]: ORDER.DESC }});
  
    const enrichedTodos = await Promise.all(
      pageRes.data.map(async (todo) => {
        const filterDto = new FilteringJobHistoryDto();
        filterDto.jobStartDate = InitStartOfDay(todo.target_start_date);
        filterDto.jobEndDate = InitEndOfDay(todo.target_end_date);
        filterDto.taskType = TASK_TYPE.OUTPUT;
        filterDto.warehouseType = WAREHOUSE_TYPE.GANTRY;
        filterDto.standardType = todo.standard_type;
        const attainmentCount = await this.gantryJobHistoryService.getGantryCounts(filterDto);
        const attainmentRate = todo.target_count ? (attainmentCount / todo.target_count) * 100 : 0;
  
        return {
          ...todo,
          attainmentCount,
          attainmentRate,
        };
      }),
    );
  
    return {
      ...pageRes,
      data: enrichedTodos,
    };
  }
  
  async softDeleteTodoById(todoId: number): Promise<boolean>{
    const result = await this.todoRepository.softDeleteTodoById(todoId);
    if(!result){
      this.logger.warn('Failed to delete');
      throw new NotFoundException(`Todo with ID ${todoId} not found`);
    };
    return result;
  };

  private async scheduleTask() {
    if (this.isRunning) {
      this.logger.warn('Todo is already running');
      return;
    }
    this.isRunning = true;

    try {
      // 날짜로 1차 거름
      const today = new Date();
      const filterDto = new FilteringTodoDto();
      filterDto.alarmProcessFlag = false;
      filterDto.targetEndDate = today;

      const rawTodoList = await this.todoRepository.getFilteredList({filter : filterDto});
      const todoList = rawTodoList.filter((todo) => {
        const targetDate = new Date(todo.target_end_date.getTime() - todo.alarm_offset_hours * 60 * 60 * 1000);
        return today.getTime() >= targetDate.getTime();
      })

      if (todoList) {
        for (const todo of todoList) {
          // 2차로 목표 출하량에 도달했는지 여부 확인
          const filterDto = new FilteringJobHistoryDto();
          filterDto.jobStartDate = todo.target_start_date;
          filterDto.jobEndDate = today;
          filterDto.taskType = TASK_TYPE.OUTPUT;
          filterDto.warehouseType = WAREHOUSE_TYPE.GANTRY;
          const gantryOutCounts = await this.gantryJobHistoryService.getGantryCounts(filterDto);

          if (gantryOutCounts < todo.target_count) {  // 목표량 미달성
            const userEmail = todo.users.email;
            const mailRequestDto = new MailRequestDto();
            mailRequestDto.to = userEmail;
            mailRequestDto.subject = 'Notice To-do List';
            mailRequestDto.text = `Notice To-do List: ${todo}`;
            await this.mailService.sendMail(mailRequestDto);

            this.sseService.sendEventToAll(SSE_EVENT_TYPE.TODO_ALERT, todo.id);
            this.todoRepository.updateTodo(todo, undefined,{ alarm_process_flag: true });
          } else {  // 목표량 달성
            this.todoRepository.updateTodo(todo, undefined,{ alarm_process_flag: true });
          }
        }
      }
    } catch (err) {
      this.logger.error('Error during todo schedule task:', err.message);
    } finally {
      this.isRunning = false;
    }
    setTimeout(() => this.scheduleTask(), 1000);
  }
};