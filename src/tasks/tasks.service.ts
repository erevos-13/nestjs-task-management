import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { TasksRepository } from './tasks.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
@Injectable()
export class TasksService {
  constructor(@InjectRepository(Task) private taskRepo: TasksRepository) {}
  // getAllTasks(): Task[] {
  //   return this.tasks;
  // }
  // getFIlterTask(filterTaskDto: GetTaskFilterDto): Task[] {
  //   const { status, search } = filterTaskDto;
  //   let tasks = this.getAllTasks();
  //   if (status) {
  //     tasks = tasks.filter((task) => task.status == status);
  //   }
  //   if (search) {
  //     tasks = tasks.filter((task) =>
  //       task.title.includes(search) || task.description.includes(search)
  //         ? true
  //         : false,
  //     );
  //   }
  //   return tasks;
  // }

  async getTaskById(id: string): Promise<Task> {
    const found = await this.taskRepo.findOne({ where: { id: id } });
    if (!found) {
      throw new NotFoundException(`Task Id: ${id} not found`);
    }
    return found;
  }
  //
  // getTaskByID(id: string): Task {
  //   const task = this.tasks.find((task) => task.id === id);

  //   return task;
  // }
  // createTask({ title, description }: CreateTaskDto): Task {
  //   const task = {
  //     id: uuid(),
  //     title,
  //     description,
  //     status: TaskStatus.IN_PROGRESS,
  //   } as Task;
  //   this.tasks.push(task);
  //   return task;
  // }
  //
  // removeTaskById(id: string): [] {
  //   const task = this.tasks.find((task) => task.id === id);
  //   if (!task) {
  //     throw new NotFoundException(`Task Id: ${id} not found`);
  //   }
  //   this.tasks = this.tasks.filter((task) => task.id !== id);
  //   return [];
  // }
  //
  // updateTaskStatusById(id: string, status: TaskStatus): Task {
  //   const task = this.tasks.find((task) => task.id === id);
  //   if (!task) {
  //     throw new NotFoundException(`Task Id: ${id} not found`);
  //   }
  //   task.status = status;
  //   return task;
  // }
}
