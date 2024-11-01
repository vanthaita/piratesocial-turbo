import { Module } from '@nestjs/common';
import { RoomUserService } from './room-user.service';
import { RoomUserController } from './room-user.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports:[PrismaModule],
  controllers: [RoomUserController],
  providers: [RoomUserService,PrismaService],
  exports:[RoomUserService]
})
export class RoomUserModule {}
