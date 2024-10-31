import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { RoomService } from './room.service';

@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post()
  async createRoom(@Body('name') name: string) {
    return this.roomService.createRoom(name);
  }

  @Post(':roomId/users/:userId')
  async addUserToRoom(
    @Param('roomId') roomId: number,
    @Param('userId') userId: number,
  ) {
    return this.roomService.addUserToRoom(roomId, userId);
  }
  @Get('user/:userId')
  async getRooms(@Param('userId') userId: number) {
    return this.roomService.getRooms(userId);
  }
  @Get()
  async getALLRooms() {
    return this.roomService.getALLRooms();
  }
}
