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
import { RedisModule } from './modules/redis/redis.module';
import { AwsS3Module } from './modules/aws/aws.module';
import { FollowModule } from './modules/follow/follow.module';
import { RedisService } from './modules/redis/redis.service';
import { SchedulerService } from './modules/scheduler/scheduler.service';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    UserModule,
    ChatModule,
    RoomModule,
    RoomUserModule,
    PrismaModule,
    AuthModule,
    FeedPostModule,
    RedisModule,
    AwsS3Module,
    FollowModule,
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService, RedisService, SchedulerService],
})
export class AppModule {}
