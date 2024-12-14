import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChatGateway } from 'src/Gateway/chat.gateway';
import { PrismaModule } from 'src/prisma/prisma.module';
import { RoomUserService } from '../room-user/room-user.service';

@Module({
  imports:[PrismaModule],
  controllers: [RoomController],
  providers: [RoomService,PrismaService, RoomUserService],
  exports: [RoomService]
})
export class RoomModule {}
