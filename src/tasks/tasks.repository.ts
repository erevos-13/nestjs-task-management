import { DataSource, EntityRepository, Repository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task.model';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TasksRepository extends Repository<Task> {
  constructor(private dataSource: DataSource) {
    super(Task, dataSource.createEntityManager());
  }
  async createTask({ title, description }: CreateTaskDto): Promise<Task> {
    const task = this.create({
      title,
      status: TaskStatus.OPEN,
      description,
    });
    await this.save(task);
    return task;
  }
}
