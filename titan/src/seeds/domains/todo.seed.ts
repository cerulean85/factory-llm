import { Logger, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ISeeder } from '../seed.interface';
import { Users } from 'src/domains/users/users/entities/users.entity';
import { Todo } from 'src/domains/todo/entities/todo.entity';
import { getRandomDateWithinLastTwoMonths, rand, stdTypes } from 'src/utils/dummy.util';

@Injectable()
export class TodoSeed implements ISeeder {
    private readonly logger = new Logger(TodoSeed.name)
    constructor(
    @InjectRepository(Todo)
    private readonly todoRepository: Repository<Todo>,
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,

  ) {}

  async setupInitialData(insertDebugData : boolean): Promise<void> {
    const cnt = await this.todoRepository.count();
    if (cnt === 0 ){
      await this.insertDefaultData();
      if(insertDebugData) {
        await this.insertTestData();
      }
    }
  }

  async insertDefaultData(): Promise<void> {}
  async insertTestData(): Promise<void> {
    this.logger.log('No todo found, inserting debug data...');

    let userList = await this.userRepository.find({where: {valid_record: true}});

    if (!userList) {
        this.logger.log('No foreign key exists for the todo');
        return;
    }

    const targetList : Todo[] = [];
    for(let i = 0; i < 20; i++) {
      const target = new Todo();
      const standardTypeNo = rand(0, 7);
      const stdType = stdTypes[standardTypeNo];

      target.target_start_date = getRandomDateWithinLastTwoMonths();
      let randomOffsetDays = rand(0, 90);
      target.target_end_date = new Date(target.target_start_date.getTime() + randomOffsetDays * 24 * 60 * 60 * 1000);
      target.target_count = rand(1, 500);;
      target.description = `타이어 생산 ${i + 1}`;
      target.standard_type = stdType;
      target.users = userList[rand(0, userList.length - 1)];

      randomOffsetDays = rand(0, 5);
      target.create_date  = new Date(target.target_start_date.getTime() - randomOffsetDays * 24 * 60 * 60 * 1000);
      targetList.push(target);
    }

    await this.todoRepository.save(targetList);
    this.logger.log('Debug data inserted!');
  }
}
