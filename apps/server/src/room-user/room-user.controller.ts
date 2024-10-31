import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RoomUserService } from './room-user.service';
import { CreateRoomUserDto } from './dto/create-room-user.dto';
import { UpdateRoomUserDto } from './dto/update-room-user.dto';

@Controller('room-user')
export class RoomUserController {
  constructor(private readonly roomUserService: RoomUserService) {}
  @Post(':roomId/users/:userId')
  async addUserToRoom(
    @Param('roomId') roomId: number,
    @Param('userId') userId: number,
  ) {
    return this.roomUserService.addUserToRoom(roomId, userId);
  }

  @Delete(':roomId/users/:userId')
  async removeUserFromRoom(
    @Param('roomId') roomId: number,
    @Param('userId') userId: number,
  ) {
    return this.roomUserService.removeUserFromRoom(roomId, userId);
  }

  @Get('rooms/:roomId/users')
  async getUsersByRoom(@Param('roomId') roomId: number) {
    return this.roomUserService.getUsersByRoom(roomId);
  }

  @Get('users/:userId/rooms')
  async getRoomsByUser(@Param('userId') userId: number) {
    return this.roomUserService.getRoomsByUser(userId);
  }
}
