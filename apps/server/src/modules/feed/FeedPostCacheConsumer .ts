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
    const redisClient = this.redisService.getClient();

    switch (message.type) {
        case 'CREATE_POST':
        // Clear cache for all posts and specific user posts
        console.log("create_post");
        await redisClient.del('feed:allPosts');
        await redisClient.del(`feed:userPosts:${message.userId}`);
        break;

        case 'DELETE_POST':
        // Clear cache for all posts and specific user posts
        await redisClient.del('feed:allPosts');
        await redisClient.del(`feed:userPosts:${message.userId}`);
        break;

        case 'COMMENT_ON_POST':
        // Clear cache for the specific post's comments
        await redisClient.del(`feed:postComments:${message.postId}`);
        break;

        case 'RETWEET_POST':
        // Clear cache for all posts and specific user posts
        await redisClient.del('feed:allPosts');
        await redisClient.del(`feed:userPosts:${message.userId}`);
        break;

        case 'UPDATE_POST':
        // Clear cache for all posts and specific user posts
        await redisClient.del('feed:allPosts');
        await redisClient.del(`feed:userPosts:${message.userId}`);
        break;

        default:
        console.warn(`Unhandled message type: ${message.type}`);
    }
    }

  
}
