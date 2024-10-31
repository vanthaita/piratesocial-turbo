import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Room } from './entity/room.entity';

@Injectable()
export class RoomService {
  constructor(private readonly prisma: PrismaService) {}

  async createRoom(name: string) {
    return this.prisma.room.create({
      data: { name },
    });
  }
  async getALLRooms() {
    return this.prisma.room.findMany();
  }

  async getRooms(userId: number) {
    console.log(userId);
    const numericUserId = Number(userId);
    const rooms = await this.prisma.roomUser.findMany({
      where: { userId: numericUserId },
    });
    const roomlist: Room[] = [];
    for (const room of rooms) {
      const roomData = await this.prisma.room.findUnique({
        where: { id: room.roomId },
      });
      if (roomData) {
        roomlist.push(roomData);
      }
    }
    return roomlist;
  }

  async addUserToRoom(roomId: number, userId: number) {
    console.log(roomId);

    let room = await this.prisma.room.findUnique({
      where: { id: roomId },
    });
    if (!room) {
      room = await this.prisma.room.create({
        data: { id: roomId, name: `Room ${roomId}` },
      });
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with id ${userId} does not exist`);
    }

    const existingRoomUser = await this.prisma.roomUser.findUnique({
      where: {
        roomId_userId: {
          roomId,
          userId,
        },
      },
    });

    if (existingRoomUser) {
      return existingRoomUser;
    }

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
}
