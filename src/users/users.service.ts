import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    return this.userRepository.save(createUserDto);
  }

  async findbyEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      email: email,
    });
  }

  async findOne(id: number): Promise<User | null> {
    const found = await this.userRepository.findOne(id);
    if (!found) {
      throw new NotFoundException();
    }
    return found;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User | null> {
    const { affected } = await this.userRepository.update(id, updateUserDto);

    if (affected === 0) {
      throw new NotFoundException();
    }
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    this.userRepository.delete(id);
  }
}
