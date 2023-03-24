import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { TasksRepository } from './tasks.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { raw } from 'express';

@Injectable()
export class TasksService {
  constructor(@InjectRepository(Task) private taskRepo: TasksRepository) {}
  async getAllTasks(): Promise<Task[]> {
    return await this.taskRepo.find();
  }
  async getFIlterTask(filterTaskDto: GetTaskFilterDto): Promise<Task[]> {
    const { status, search } = filterTaskDto;
    return await this.taskRepo.find({
      where: [
        { status, title: search },
        { status, description: search },
      ],
    });
  }

  async getTaskById(id: string): Promise<Task> {
    const found = await this.taskRepo.findOne({ where: { id: id } });
    if (!found) {
      throw new NotFoundException(`Task Id: ${id} not found`);
    }
    return found;
  }

  async createTask({ title, description }: CreateTaskDto): Promise<Task> {
    const task = this.taskRepo.create({
      title,
      status: TaskStatus.OPEN,
      description,
    });
    await this.taskRepo.save(task);
    return task;
  }

  async removeTaskById(id: string): Promise<[]> {
    const result = await this.taskRepo.delete(id);
    console.log({ result });
    if (result.affected === 0) {
      throw new NotFoundException(`Task with id : ${id} not found`);
    }
    return [];
  }

  async updateTaskStatusById(id: string, status: TaskStatus): Promise<Task> {
    const task = await this.getTaskById(id);
    task.status = status;
    await this.taskRepo.save(task);
    return task;
  }
}
