import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RoomUserService {
  constructor(private readonly prisma: PrismaService) {}
  async addUserToRoom(
    roomId: number,
    userId: number,
    details: {
      name: string;
      status: string;
      time: string;
      lastMessage?: string;
      unread?: number;
      imgSrc: string;
    }
  ) {
    const { name, status, time, lastMessage = '', unread = 0, imgSrc } = details;
  
    try {
      const roomExists = await this.prisma.room.findUnique({ where: { id: roomId } });
      if (!roomExists) {
        throw new Error(`Room with ID ${roomId} does not exist.`);
      }
  
      const userExists = await this.prisma.user.findUnique({ where: { id: userId } });
      if (!userExists) {
        throw new Error(`User with ID ${userId} does not exist.`);
      }
  
      const existingRoomUser = await this.prisma.roomUser.findUnique({
        where: {
          roomId_userId: { roomId, userId },
        },
      });
  
      if (existingRoomUser) {
        return existingRoomUser;
      }
  
      return await this.prisma.roomUser.create({
        data: {
          name,
          status,
          time,
          lastMessage,
          unread,
          imgSrc,
          room: { connect: { id: roomId } },
          user: { connect: { id: userId } },
        },
      });
    } catch (error) {
      throw new Error(`Error adding user to room: ${error.message}`);
    }
  }

  async removeUserFromRoom(roomId: number, userId: number) {
    return this.prisma.roomUser.deleteMany({
      where: {
        roomId,
        userId,
      },
    });
  }
  async updateLastMessageinRoom(roomId: number, lastMessage: string, createdAt: string) {
    return this.prisma.roomUser.updateMany({
      where: {
        roomId,
      },
      data: {
        lastMessage, 
        time: createdAt,
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
    if(!userId) return {
      message: 'User ID is required',
      statusCode: 400,
    }
    return this.prisma.roomUser.findMany({
      where: { userId },
      include: { room: true },
    });
  }
}
