import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChatGateway } from 'src/Gateway/chat.gateway';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports:[PrismaModule],
  controllers: [RoomController],
  providers: [RoomService,PrismaService],
  exports: [RoomService]
})
export class RoomModule {}
