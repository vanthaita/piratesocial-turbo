import {
  Controller,
  Post,
  Get,
  Put,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '../auth/auth.gaurd';
import { CreateUserDto } from '../../dto/userDto/create-user.dto';
import { UpdateUserDto } from '../../dto/userDto/update-user.dto';

@Controller('users')
// @UseGuards(AuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Post('bulk')
  createManyUsers(@Body() createUserDtos: CreateUserDto[]) {
    return this.userService.createManyUsers(createUserDtos);
  }

  @Get(':id')
  async getUser(@Param('id') id: number) {
    return this.userService.getUser(+id);
  }
  @Get()
  async getAll() {
    return this.userService.getAll();
  }

  @Put(':id')
  async updateUser(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateUser(id, updateUserDto);
  }
}
