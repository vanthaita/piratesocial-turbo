/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  async sendMessage(roomId: number, senderId: number, message: string) {
    if (!message) throw new Error('Message content is missing');
    
    const sentData = await this.prisma.chat.create({
      data: { roomId, senderId, message },
      select: {
        id: true,
        roomId: true,
        senderId: true,
        message: true,
        createdAt: true,
        sender: {
          select: {
            email: true,
            picture: true,
          },
        },
      },
    });
    
    console.log("sendMessage:", sentData);
    return sentData;
  }

  async getMessagesByRoom(roomId: number) {
    return this.prisma.chat.findMany({
      where: { roomId },
      select: {
        id: true,
        roomId: true,
        senderId: true,
        message: true,
        createdAt: true,
        sender: {
          select: {
            email: true,
            picture: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });
  }
}
