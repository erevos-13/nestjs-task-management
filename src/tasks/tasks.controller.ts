import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TaskStatus } from './task.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './task.entity';

@Controller('tasks')
export class TasksController {
  constructor(private taskSrv: TasksService) {}

  @Get()
  async getTasks(@Query() filterDto: GetTaskFilterDto): Promise<Task[]> {
    if (Object.keys(filterDto).length) {
      return this.taskSrv.getFIlterTask(filterDto);
    }
    return this.taskSrv.getAllTasks();
  }

  @Post()
  createTask(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    return this.taskSrv.createTask(createTaskDto);
  }

  @Get('/:id')
  getTaskById(@Param('id') id: string): Promise<Task> {
    return this.taskSrv.getTaskById(id);
  }

  @Delete('/:id')
  deleteTaskById(@Param('id') id: string): Promise<[]> {
    return this.taskSrv.removeTaskById(id);
  }

  @Patch('/:id/status')
  updateTaskStatus(
    @Param('id') id: string,
    @Body() updateStateDto: UpdateTaskDto,
  ): Promise<Task> {
    const { status } = updateStateDto;
    return this.taskSrv.updateTaskStatusById(id, status);
  }
}
