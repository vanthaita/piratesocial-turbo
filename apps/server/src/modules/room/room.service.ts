import { Injectable, NotFoundException } from '@nestjs/common';
import { Room } from '../../entites/roomEntity/room.entity';
import { PrismaService } from '../../prisma/prisma.service';
import { RoomUserService } from '../room-user/room-user.service';

@Injectable()
export class RoomService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly roomUserService: RoomUserService
    
  ) {}

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
  async createOneToOneRoom(name: string) {
    return this.prisma.room.create({
      data: {
        name,
        type: 'ONE_TO_ONE',
      },
    });
  }
  async addAndCreateUserToRoom(userId: number, anotherUserId: number) {
    let existingRoom = await this.findRoomByUsers(userId, anotherUserId);
    const roomName = `${userId} + ${anotherUserId} room`;
  
    if (!existingRoom) {
      existingRoom = await this.createOneToOneRoom(roomName);
    }
  
    const existingRoomUserForUser = await this.prisma.roomUser.findUnique({
      where: {
        roomId_userId: { roomId: existingRoom.id, userId },
      },
    });
  
    const existingRoomUserForAnotherUser = await this.prisma.roomUser.findUnique({
      where: {
        roomId_userId: { roomId: existingRoom.id, userId: anotherUserId },
      },
    });
  
    if (!existingRoomUserForUser) {
      const userDetails = await this.getNameAndImageUser(userId);
      const detailsForUserId = {
        name: userDetails.name,
        status: 'active',
        time: 'now',
        lastMessage: '',
        unread: 0,
        imgSrc: userDetails.picture,
      };
  
      await this.roomUserService.addUserToRoom(existingRoom.id, userId, detailsForUserId);
    }
  
    if (!existingRoomUserForAnotherUser) {
      const anotherUserDetails = await this.getNameAndImageUser(anotherUserId);
      const detailsForAnotherUserId = {
        name: anotherUserDetails.name,
        status: 'active',
        time: 'now',
        lastMessage: '',
        unread: 0,
        imgSrc: anotherUserDetails.picture,
      };
  
      await this.roomUserService.addUserToRoom(existingRoom.id, anotherUserId, detailsForAnotherUserId);
    }
  
    return existingRoom;
  }
  async findRoomByUsers(userId: number, anotherUserId: number) {
    return this.prisma.room.findFirst({
      where: {
        users: {
          every: {
            userId: {
              in: [userId, anotherUserId],
            },
          },
        },
      },
    });
  }
  async getNameAndImageUser(userId: number) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, picture: true },
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
