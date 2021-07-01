import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  async create(createTaskDto: CreateTaskDto, user: any): Promise<Task> {
    const data = { ...createTaskDto, user: user.id };
    return this.taskRepository.save(data);
  }

  async findAll(user: any): Promise<Task[]> {
    return this.taskRepository.find({ user: user.id });
  }

  async findOne(id: string, user: any): Promise<Task | null> {
    const found = await this.taskRepository.findOne({ id: id, user: user.id });
    if (!found) {
      throw new NotFoundException();
    }
    return found;
  }

  async update(
    id: string,
    updateTaskDto: UpdateTaskDto,
    user: any,
  ): Promise<Task | null> {
    const { affected } = await this.taskRepository.update(
      { id, user: user.id },
      updateTaskDto,
    );
    if (affected === 0) {
      throw new NotFoundException();
    }
    return this.findOne(id, user);
  }

  async remove(id: string, user: any): Promise<void> {
    this.taskRepository.delete({ id, user: user.id });
  }
}
