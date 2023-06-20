import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import { IDatabase, database } from '../util/database/database';

@Injectable()
export class UsersService {
  private database: IDatabase;

  constructor() {
    this.database = database;
  }

  create(createUserDto: CreateUserDto) {
    return this.database.create(createUserDto);
  }

  findAll(name?: string) {
    if (name) {
      return this.database.findByName(name);
    } else {
      return this.database.findAll();
    }
  }

  findById(id: number) {
    return this.database.findById(id);
  }

  findAccess(id: number) {
    return this.database.getAccessCount(id);
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    const user = this.database.update(id, updateUserDto);
    if (user) {
      return user;
    } else {
      throw new NotFoundException('User not found');
    }
  }

  remove(id: number) {
    const deleted = this.database.delete(id);
    if (!deleted) {
      throw new NotFoundException('User not found');
    }
    return;
  }
}
