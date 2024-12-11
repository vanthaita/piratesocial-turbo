import { Module } from '@nestjs/common';
import { FeedPostController } from './feed.post.controller';
import { FeedPostService } from './feed.post.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { RedisModule } from '../redis/redis.module';
import { RedisService } from '../redis/redis.service';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { MulterModule } from '@nestjs/platform-express';
import { AwsS3Service } from '../aws/aws.service';
@Module({
  imports: [PrismaModule, RedisModule,MulterModule.register({
    limits: { fileSize: 5 * 1024 * 1024 }, // Giới hạn file 5MB
  }),],
  controllers: [FeedPostController],
  providers: [
    FeedPostService,
    RedisService,
    AwsS3Service,
    {
      provide: 'RABBITMQ_CLIENT',
      useFactory: () => 
        ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            urls: ['amqp://localhost:5672'],
            queue: 'feed_queue',
            queueOptions: { durable: false },
          },
        }),
    },
  ],
  exports: ['RABBITMQ_CLIENT'], 
})
export class FeedPostModule {}
