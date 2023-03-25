import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { TaskStatus } from './task.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { TasksRepository } from './tasks.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { raw } from 'express';
import { AuthEntity } from '../auth/auth.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TasksService {
  private logger = new Logger('TasksService', { timestamp: true });
  constructor(
    @InjectRepository(Task) private taskRepo: TasksRepository,
    private configSrv: ConfigService,
  ) {
    const confgiValue = configSrv.get('TEST_VALUE');
    console.log({ confgiValue });
  }
  async getAllTasks(): Promise<Task[]> {
    return await this.taskRepo.find();
  }
  async getFIlterTask(
    filterTaskDto: GetTaskFilterDto,
    user: AuthEntity,
  ): Promise<Task[]> {
    const { status, search } = filterTaskDto;
    const query = this.taskRepo.createQueryBuilder('task');

    if (search || status) {
      try {
        return await query
          .where('task.user.id  =:id', { id: user.id })
          .andWhere(
            '(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))',
            {
              search,
            },
          )
          .getMany();
      } catch (e) {
        throw new InternalServerErrorException();
        this.logger.error(
          `Fail to get task user:${user.id} ${JSON.stringify(filterTaskDto)}`,
          e.stack,
        );
      }
    }
    try {
      return await query.where('task.user.id  =:id', { id: user.id }).getMany();
    } catch (e) {
      throw new InternalServerErrorException();
      this.logger.error(
        `Fail to get task user:${user.id} ${JSON.stringify(filterTaskDto)}`,
        e.stack,
      );
    }
  }

  async getTaskById(id: string, user: AuthEntity): Promise<Task> {
    const query = this.taskRepo.createQueryBuilder('task');
    const found = await query
      .where('task.user.id = :id', { id: user.id })
      .andWhere('task.id = :taskId', { taskId: id })
      .getOne();
    if (!found) {
      throw new NotFoundException(`Task Id: ${id} not found`);
    }
    return found;
  }

  async createTask(
    { title, description }: CreateTaskDto,
    user: AuthEntity,
  ): Promise<Task> {
    const task = this.taskRepo.create({
      title,
      status: TaskStatus.OPEN,
      description,
      user,
    });
    await this.taskRepo.save(task);
    return task;
  }

  async removeTaskById(id: string, user: AuthEntity): Promise<[]> {
    const result = await this.taskRepo.delete({ id, user });
    console.log({ result });
    if (result.affected === 0) {
      throw new NotFoundException(`Task with id : ${id} not found`);
    }
    return [];
  }

  async updateTaskStatusById(
    id: string,
    status: TaskStatus,
    user: AuthEntity,
  ): Promise<Task> {
    const task = await this.getTaskById(id, user);
    task.status = status;
    await this.taskRepo.save(task);
    return task;
  }
}
