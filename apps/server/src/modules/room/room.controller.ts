import { Controller, Post, Body, Param, Get, Request, UseGuards } from '@nestjs/common';
import { RoomService } from './room.service';
import { AuthGuard as JWTAuthGuard } from '../auth/auth.gaurd';
import { Request as ExpressRequest } from 'express';
@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post()
  async createRoom(@Body('name') name: string) {
    return this.roomService.createRoom(name);
  }
  @UseGuards(JWTAuthGuard)
  @Post('create-one-to-one/:anotherId')
  async AddAndCreateUserToRoom(@Param('anotherId') anotherUserId: number,@Request() req: ExpressRequest) {
    const userId = req.user?.id;
    return this.roomService.addAndCreateUserToRoom(+userId,+anotherUserId);
  }

  // @Post(':roomId/users/:userId')
  // async addUserToRoom(
  //   @Param('roomId') roomId: number,
  //   @Param('userId') userId: number,
  // ) {
  //   return this.roomService.addAndCreateUserToRoom(roomId, userId);
  // }
  @Get('user/:userId')
  async getRooms(@Param('userId') userId: number) {
    return this.roomService.getRooms(userId);
  }
  @Get()
  async getALLRooms() {
    return this.roomService.getALLRooms();
  }
}
