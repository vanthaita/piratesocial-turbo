import { Injectable, NotFoundException, ForbiddenException, Inject } from '@nestjs/common';
import { FeedPost, Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { ClientProxy } from '@nestjs/microservices';
import { RedisService } from '../redis/redis.service';
import { console } from 'inspector';

@Injectable()
export class FeedPostService {
  private readonly cacheKeyAllPosts = 'feed:allPosts';
  private readonly cacheKeyUserPosts = (userId: number) => `feed:userPosts:${userId}`;
  private readonly cacheKeyPostComments = (postId: number) => `feed:postComments:${postId}`;
  constructor(
    private readonly prisma: PrismaService,
    private readonly redisService: RedisService,
    @Inject('RABBITMQ_CLIENT') private readonly rabbitMQClient: ClientProxy,
  ) {}
  // Fetch all posts with Redis caching
  async getFeedAllPosts(skip = 0, take = 10) {
    const redisClient = this.redisService.getClient();
    const cacheKey = `${this.cacheKeyAllPosts}:${skip}:${take}`;
    
    // Check cache
    const cachedData = await redisClient.get(cacheKey);
    console.log(cachedData);
    if (cachedData) {
      return JSON.parse(cachedData);
    }
  
    // Fetch from DB with proper pagination logic
    const posts = await this.prisma.feedPost.findMany({
      skip: skip,
      take: take,
      orderBy: { createdAt: 'desc' },  // Ensure ordering based on createdAt or another field
      include: {
        user: { select: { id: true, name: true, providerId: true, picture: true } },
        likes: true,
        comments: {
          select: {
            user: {
              select: { id: true, name: true, providerId: true, picture: true }
            },
            createdAt: true,
            content: true,
            userId: true,
            postId: true,
          }
        },
        retweets: true,
      },
      distinct: ['id'],  // Ensure unique posts
    });
  
    // Store in cache with a TTL
    await redisClient.set(cacheKey, JSON.stringify(posts), 'EX', 60);  // Cache expiry set to 60 seconds
  
    return posts;
  }
  

  // Create a new post and clear cache
  async createFeedPost(data: Prisma.FeedPostCreateInput, userId: number) {
    const redisClient = this.redisService.getClient();
  
    // Create post in DB
    const newPost = await this.prisma.feedPost.create({
      data: { userId, content: data.content, imagesUrl: data.imagesUrl || [] },
    });
  
    // Clear all related cache keys
    const allPostKeys = await redisClient.keys(`${this.cacheKeyAllPosts}:*`);
    if (allPostKeys.length > 0) {
      await redisClient.del(allPostKeys);
    }
    await redisClient.del(this.cacheKeyUserPosts(userId));
  
    // Notify RabbitMQ
    this.rabbitMQClient.emit('cache_update', {
      type: 'CREATE_POST',
      userId,
      postId: newPost.id,
    });
  
    // Return the new post directly
    return newPost;
  }
  

  // Like a post and clear cache
  async likePost(postId: number, userId: number) {
    const redisClient = this.redisService.getClient();

    // Check if already liked
    const existingLike = await this.prisma.feedPostLike.findUnique({
      where: { postId_userId: { postId, userId } },
    });
    if (existingLike) {
      throw new ForbiddenException('Post already liked by this user.');
    }

    // Add like and update likes count
    await this.prisma.feedPostLike.create({ data: { postId, userId } });
    const updatedPost = await this.prisma.feedPost.update({
      where: { id: postId },
      data: { likesCount: { increment: 1 } },
    });

    // Clear related cache
    await redisClient.del(this.cacheKeyAllPosts);

    // Notify RabbitMQ
    this.rabbitMQClient.emit('cache_update', {
      type: 'LIKE_POST',
      postId,
      userId,
    });

    return updatedPost;
  }
  async getFeedPosts(userId: number, skip = 0, take = 10) {
    const redisClient = this.redisService.getClient();
    const cacheKey = `${this.cacheKeyUserPosts(userId)}:${skip}:${take}`;

    // Check cache
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      return JSON.parse(cachedData);
    }

    // Fetch from DB
    const posts = await this.prisma.feedPost.findMany({
      where: { userId },
      skip,
      take,
      include: {
        user: true,
        likes: true,
        comments: { take: 5 },
      },
    });

    // Cache the results
    await redisClient.set(cacheKey, JSON.stringify(posts), 'EX', 60);

    return posts;
  }

  // Add comment to post
  async commentOnPost(postId: number, userId: number, content: string) {
    const redisClient = this.redisService.getClient();

    // Create comment in DB
    const newComment = await this.prisma.feedPostComment.create({
      data: { postId, userId, content },
    });

    // Clear related cache
    await redisClient.del(this.cacheKeyPostComments(postId));

    // Notify RabbitMQ
    this.rabbitMQClient.emit('cache_update', {
      type: 'COMMENT_ON_POST',
      postId,
      userId,
      commentId: newComment.id,
    });

    return newComment;
  }

  // Retweet a post
  async retweetPost(postId: number, userId: number) {
    const redisClient = this.redisService.getClient();

    // Upsert retweet
    const retweet = await this.prisma.retweet.upsert({
      where: { postId_userId: { postId, userId } },
      create: { postId, userId },
      update: {},
    });

    // Notify RabbitMQ
    this.rabbitMQClient.emit('cache_update', {
      type: 'RETWEET_POST',
      postId,
      userId,
    });

    return retweet;
  }

  // Delete a feed post
  async deleteFeedPost(postId: number, userId: number) {
    const redisClient = this.redisService.getClient();

    // Check if post exists
    const post = await this.prisma.feedPost.findUnique({
      where: { id: postId },
    });
    if (!post) {
      throw new NotFoundException('Post not found.');
    }

    // Check authorization
    if (post.userId !== userId) {
      throw new ForbiddenException('You are not authorized to delete this post.');
    }

    // Delete the post
    await this.prisma.feedPost.delete({ where: { id: postId } });

    // Clear related cache
    await redisClient.del(this.cacheKeyAllPosts);
    await redisClient.del(this.cacheKeyUserPosts(userId));

    // Notify RabbitMQ
    this.rabbitMQClient.emit('cache_update', {
      type: 'DELETE_POST',
      postId,
      userId,
    });

    return { message: 'Post deleted successfully.' };
  }
  async hasUserLikedPost(postId: number, userId: number) {
    const like = await this.prisma.feedPostLike.findUnique({
      where: { postId_userId: { postId, userId } },
    });
    return !!like;
  }
  
  // Helper to clear cache
  private async clearCacheForPost(postId: number, userId: number) {
    const redisClient = this.redisService.getClient();
    await redisClient.del(this.cacheKeyAllPosts);
    await redisClient.del(this.cacheKeyUserPosts(userId));
  }
}
