import { Module } from '@nestjs/common';
import { FeedPostController } from './feed.post.controller';
import { FeedPostService } from './feed.post.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { RedisModule } from '../redis/redis.module';
import { RedisService } from '../redis/redis.service';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';

@Module({
  imports: [PrismaModule, RedisModule],
  controllers: [FeedPostController],
  providers: [
    FeedPostService,
    RedisService,
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
