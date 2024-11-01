import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { RoomModule } from '../room/room.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChatGateway } from 'src/Gateway/chat.gateway';

@Module({
  imports: [RoomModule],
  controllers: [ChatController],
  providers: [ChatService,PrismaService,ChatGateway],
  exports: [ChatService]
})
export class ChatModule {}
