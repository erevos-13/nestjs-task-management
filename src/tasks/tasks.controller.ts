import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TaskStatus } from './task.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './task.entity';
import { AuthGuard } from '@nestjs/passport';
import { AuthEntity } from '../auth/auth.entity';
import { GetUser } from '../auth/get-user.decorator';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  private logger = new Logger('Task Controller', { timestamp: true });
  constructor(private taskSrv: TasksService) {}

  @Get()
  async getTasks(
    @Query() filterDto: GetTaskFilterDto,
    @GetUser() user: AuthEntity,
  ): Promise<Task[]> {
    this.logger.verbose(
      `Get all task user: ${
        user.username
      } retrive all task, Filters: ${JSON.stringify(filterDto)}`,
    );
    return this.taskSrv.getFIlterTask(filterDto, user);
  }

  @Post()
  createTask(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: AuthEntity, //INFO custom decortor
  ): Promise<Task> {
    this.logger.verbose(
      `User: ${user.username} create task: ${JSON.stringify(createTaskDto)}`,
    );
    return this.taskSrv.createTask(createTaskDto, user);
  }

  @Get('/:id')
  getTaskById(
    @Param('id') id: string,
    @GetUser() user: AuthEntity,
  ): Promise<Task> {
    return this.taskSrv.getTaskById(id, user);
  }

  @Delete('/:id')
  deleteTaskById(
    @Param('id') id: string,
    @GetUser() user: AuthEntity,
  ): Promise<[]> {
    return this.taskSrv.removeTaskById(id, user);
  }

  @Patch('/:id/status')
  updateTaskStatus(
    @Param('id') id: string,
    @Body() updateStateDto: UpdateTaskDto,
    @GetUser() user: AuthEntity,
  ): Promise<Task> {
    const { status } = updateStateDto;
    return this.taskSrv.updateTaskStatusById(id, status, user);
  }
}
