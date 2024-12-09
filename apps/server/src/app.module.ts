/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './modules/user/user.module';
import { ChatModule } from './modules/chat/chat.module';
import { RoomModule } from './modules/room/room.module';
import { RoomUserModule } from './modules/room-user/room-user.module';
import { AuthModule } from './modules/auth/auth.module';
import { FeedPostModule } from './modules/feed/feed.post.module';

@Module({
  imports: [
    UserModule,
    ChatModule,
    RoomModule,
    RoomUserModule,
    PrismaModule,
    AuthModule,
    FeedPostModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
