import { Injectable } from '@nestjs/common';
import { CreateRoomUserDto } from './dto/create-room-user.dto';
import { UpdateRoomUserDto } from './dto/update-room-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RoomUserService {
  constructor(private readonly prisma: PrismaService) {}

  async addUserToRoom(roomId: number, userId: number) {
    return this.prisma.roomUser.create({
      data: {
        roomId,
        userId,
      },
    });
  }

  async removeUserFromRoom(roomId: number, userId: number) {
    return this.prisma.roomUser.deleteMany({
      where: {
        roomId,
        userId,
      },
    });
  }

  async getUsersByRoom(roomId: number) {
    return this.prisma.roomUser.findMany({
      where: { roomId },
      include: { user: true },
    });
  }

  async getRoomsByUser(userId: number) {
    return this.prisma.roomUser.findMany({
      where: { userId },
      include: { room: true },
    });
  }
}
