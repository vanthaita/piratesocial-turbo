import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { RoomModule } from '../room/room.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChatGateway } from 'src/Gateway/chat.gateway';
import { RedisService } from '../redis/redis.service';

@Module({
  imports: [RoomModule],
  controllers: [ChatController],
  providers: [ChatService,PrismaService,ChatGateway, RedisService],
  exports: [ChatService]
})
export class ChatModule {}
