import { Controller, OnModuleInit } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { RedisService } from '../redis/redis.service';

@Controller()
export class FeedPostCacheConsumer implements OnModuleInit {
  constructor(private readonly redisService: RedisService) {}

  onModuleInit() {
    console.log('FeedPostCacheConsumer initialized.');
  }

  @MessagePattern('cache_update')
  async handleCacheUpdate(message: any) {
    console.log('Received cache_update message:', message);

    const redisClient = this.redisService.getClient();

    switch (message.type) {
      case 'CREATE_POST':
        console.log('Handling CREATE_POST...');
        await redisClient.del('feed:allPosts');
        await redisClient.del(`feed:userPosts:${message.userId}`);
        break;

      case 'DELETE_POST':
        console.log('Handling DELETE_POST...');
        await redisClient.del('feed:allPosts');
        await redisClient.del(`feed:userPosts:${message.userId}`);
        break;

      case 'COMMENT_ON_POST':
        console.log('Handling COMMENT_ON_POST...');
        await redisClient.del(`feed:postComments:${message.postId}`);
        break;

      case 'RETWEET_POST':
        console.log('Handling RETWEET_POST...');
        await redisClient.del('feed:allPosts');
        await redisClient.del(`feed:userPosts:${message.userId}`);
        break;

      case 'UPDATE_POST':
        console.log('Handling UPDATE_POST...');
        await redisClient.del('feed:allPosts');
        await redisClient.del(`feed:userPosts:${message.userId}`);
        break;

      default:
        console.warn(`Unhandled message type: ${message.type}`);
    }
  }
}
