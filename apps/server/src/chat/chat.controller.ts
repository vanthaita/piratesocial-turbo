import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  async sendMessage(
    @Body('roomId') roomId: number,
    @Body('senderId') senderId: number,
    @Body('message') message: string,
  ) {
    return this.chatService.sendMessage(roomId, senderId, message);
  }

  @Get(':roomId')
  async getMessagesByRoom(@Query('roomId') roomId: number) {
    return this.chatService.getMessagesByRoom(roomId);
  }
}
