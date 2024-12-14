import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { RoomUserService } from './room-user.service';
import { AuthGuard as JWTAuthGuard } from '../auth/auth.gaurd';
import { Request as ExpressRequest } from 'express';
@Controller('room-user')
export class RoomUserController {
  constructor(private readonly roomUserService: RoomUserService) {}
  // @Post(':roomId/users/:userId')
  // async addUserToRoom(
  //   @Param('roomId') roomId: number,
  //   @Param('userId') userId: number,
  // ) {
  //   return this.roomUserService.addUserToRoom(roomId, userId);
  // }

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

  @UseGuards(JWTAuthGuard)
  @Get('users/rooms')
  async getRoomsByUser(@Request() req: ExpressRequest) {
    const userId = req.user?.id;
    return this.roomUserService.getRoomsByUser(+userId);
  }
}
