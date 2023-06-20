import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ValidationPipe } from '../util/validation/validation.pipe';
import {
  IResponse,
  SuccessResponse,
  ErrorResponse,
} from '../util/http/response.interface';
import { User } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(
    @Body(new ValidationPipe()) createUserDto: CreateUserDto,
  ): Promise<IResponse<User>> {
    try {
      const result = await this.usersService.create(createUserDto);
      return SuccessResponse(result);
    } catch (error) {
      throw new BadRequestException(ErrorResponse(error.message));
    }
  }

  @Get()
  async findAll(@Query('name') name?: string): Promise<IResponse<User[]>> {
    try {
      const result = await this.usersService.findAll(name);
      return SuccessResponse(result);
    } catch (error) {
      throw new BadRequestException(ErrorResponse(error.message));
    }
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<IResponse<User>> {
    try {
      const result = await this.usersService.findById(+id);
      return SuccessResponse(result);
    } catch (error) {
      throw new BadRequestException(ErrorResponse(error.message));
    }
  }

  @Get(':id/access')
  async findAccess(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<IResponse<number>> {
    try {
      const result = await this.usersService.findAccess(+id);
      return SuccessResponse(result);
    } catch (error) {
      throw new BadRequestException(ErrorResponse(error.message));
    }
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe()) updateUserDto: UpdateUserDto,
  ): Promise<IResponse<User>> {
    try {
      const result = await this.usersService.update(+id, updateUserDto);
      return SuccessResponse(result);
    } catch (error) {
      throw new BadRequestException(ErrorResponse(error.message));
    }
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<IResponse<void>> {
    try {
      const result = await this.usersService.remove(+id);
      return SuccessResponse(result);
    } catch (error) {
      throw new BadRequestException(ErrorResponse(error.message));
    }
  }
}
