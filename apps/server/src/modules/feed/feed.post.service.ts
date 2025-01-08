import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Inject,
  Logger,
} from '@nestjs/common';
import { FeedPost, Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { ClientProxy } from '@nestjs/microservices';
import { RedisService } from '../redis/redis.service';
import { AwsS3Service } from '../aws/aws.service';
import { NotificationsService } from '../notifications/notifications.service';

const CACHE_EXPIRATION_SECONDS = 120;

@Injectable()
export class FeedPostService {
  private readonly logger = new Logger(FeedPostService.name);
  private readonly cacheKeyAllPosts = 'feed:allPosts';
  private readonly cacheKeyDiscoverPosts = 'feed:discover';
  private readonly cacheKeyUserPosts = (userId: number) => `feed:userPosts:${userId}`;
  private readonly cacheKeyPostDetails = (postId: number) => `feed:postDetails:${postId}`;
  private readonly cacheKeyPostComments = (postId: number) => `feed:postComments:${postId}`;
  private readonly defaultTake = 10;

  constructor(
      private readonly prisma: PrismaService,
      private readonly redisService: RedisService,
      private readonly awsS3Service: AwsS3Service,
      private readonly notificationService: NotificationsService,
      @Inject('RABBITMQ_CLIENT') private readonly rabbitMQClient: ClientProxy,
  ) { }

  private getCacheKey(prefix: string, skip?: number, take?: number, userId?: number): string {
      let key = prefix;
      if (userId) {
        key += `:${userId}`
      }
      if (skip !== undefined && take !== undefined) {
          key += `:${skip}:${take}`;
      }
      return key;
    }
    
  private async getCachedData<T>(cacheKey: string): Promise<T | null> {
      const redisClient = this.redisService.getClient();
      try {
          const cachedData = await redisClient.get(cacheKey);
          if (cachedData) {
              return JSON.parse(cachedData) as T;
          }
          return null;
      } catch (error) {
          this.logger.error(`Error getting cached data for key ${cacheKey}:`, error);
          return null;
      }
  }

  private async setCachedData<T>(cacheKey: string, data: T): Promise<void> {
      const redisClient = this.redisService.getClient();
      try {
          await redisClient.set(cacheKey, JSON.stringify(data), 'EX', CACHE_EXPIRATION_SECONDS);
      } catch (error) {
          this.logger.error(`Error setting cached data for key ${cacheKey}:`, error);
      }
  }


  async getFeedAllPosts(skip = 0, take = this.defaultTake) {
    const cacheKey = this.getCacheKey(this.cacheKeyAllPosts, skip, take);
      const cachedPosts = await this.getCachedData<FeedPost[]>(cacheKey);

    if (cachedPosts) {
      this.logger.debug(`Returning cached posts for key ${cacheKey}`);
      return cachedPosts;
    }

      const posts = await this.prisma.feedPost.findMany({
          skip,
          take,
          orderBy: { createdAt: 'desc' },
          include: {
            user: { select: { id: true, name: true, picture: true } },
            likes: true,
            comments: true,
            retweets: true,
          },
      });
  
      await this.setCachedData(cacheKey, posts);
      return posts;
  }

  async getDiscoverPosts(skip = 0, take = this.defaultTake, currentUserId?: number) {
      const cacheKey = this.getCacheKey(this.cacheKeyDiscoverPosts, skip, take);
      const cachedPosts = await this.getCachedData<FeedPost[]>(cacheKey);
      if (cachedPosts) {
          this.logger.debug(`Returning cached discover posts for key ${cacheKey}`);
          return cachedPosts;
      }


    const posts = await this.prisma.feedPost.findMany({
      skip,
      take,
      orderBy: [
          { likes: { _count: 'desc' } },
          { comments: { _count: 'desc' } },
          { createdAt: 'desc' },
      ],
      include: {
        user: { select: { id: true, name: true, picture: true } },
        likes: true,
        comments: true,
        retweets: true,
      },
    });

      await this.setCachedData(cacheKey, posts);
      return posts;
  }

  async createFeedPost(
      data: Prisma.FeedPostCreateInput,
      userId: number,
      files?: Express.Multer.File[],
  ) {
      const imageUrls = files
          ? await Promise.all(
              files.map(async (file) =>
                  this.awsS3Service.uploadImage(file.buffer, file.mimetype),
              ),
          )
          : [];

      const newPost = await this.prisma.feedPost.create({
          data: { userId, content: data.content, imagesUrl: imageUrls },
      });

     this.clearCacheForPost(newPost.id, userId);

      await this.notificationService.notifyFollowers(userId, newPost.id, newPost.content);

      return newPost;
  }

  private async invalidateCache(keys: string[]): Promise<void> {
    const redisClient = this.redisService.getClient();
    try {
        if (keys.length > 0) {
            await redisClient.del(keys);
        }
    } catch (err) {
        this.logger.error('Error invalidating cache:', err);
    }
  }


  async likePost(postId: number, userId: number) {
      const existingLike = await this.prisma.feedPostLike.findUnique({
          where: { postId_userId: { postId, userId } },
      });
      if (existingLike) {
          throw new ForbiddenException('Post already liked by this user.');
      }
      await this.prisma.feedPostLike.create({ data: { postId, userId } });
    await this.prisma.feedPost.update({
      where: { id: postId },
      data: { likesCount: { increment: 1 } },
    });
  const postCacheKey = this.cacheKeyPostDetails(postId);
    const postCacheKeyAllPost = this.cacheKeyAllPosts;
     this.invalidateCache([postCacheKey, postCacheKeyAllPost]);


      await this.notificationService.likePost(userId, postId);
      return { message: 'Post liked successfully' };
  }

  async getFeedPosts(userId: number, skip = 0, take = this.defaultTake) {
      this.logger.debug(`Fetching feed posts for user: ${userId}, skip: ${skip}, take: ${take}`);

      const cacheKey = this.getCacheKey(this.cacheKeyUserPosts(userId), skip, take);
      const cachedPosts = await this.getCachedData<FeedPost[]>(cacheKey);
      if (cachedPosts) {
        this.logger.debug(`Returning cached posts for key ${cacheKey}`);
          return cachedPosts;
      }


      const followedUsers = await this.prisma.following.findMany({
          where: { followerId: userId },
          select: { followeeId: true },
      });
      const followedUserIds = followedUsers.map(f => f.followeeId);

    if (followedUserIds.length === 0) {
          this.logger.warn('No followed users found.');
          return [];
      }
  const posts = await this.prisma.feedPost.findMany({
          where: { userId: { in: followedUserIds } },
          skip: skip,
          take: take,
          orderBy: { createdAt: 'desc' },
          include: {
            user: { select: { id: true, name: true, picture: true } },
            likes: true,
            comments: {
              select: {
                user: {
                  select: { id: true, name: true, picture: true }
                },
                createdAt: true,
                content: true,
                userId: true,
                postId: true,
              }
            },
            retweets: true,
          },
          distinct: ['id'],
      });

      await this.setCachedData(cacheKey, posts);
      return posts;
  }
  async commentOnPost(postId: number, userId: number, content: string) {

    const newComment = await this.prisma.feedPostComment.create({
      data: { postId, userId, content },
    });
    const postCacheKey = this.cacheKeyPostDetails(postId);
    const postCacheKeyAllPost = this.cacheKeyAllPosts;
    this.invalidateCache([postCacheKey, postCacheKeyAllPost, this.cacheKeyPostComments(postId)]);

    this.rabbitMQClient.emit('cache_update', {
      type: 'COMMENT_ON_POST',
      postId,
      userId,
      commentId: newComment.id,
    });
    await this.notificationService.commentPost(userId, newComment.postId, newComment.content);
    return newComment;
  }

  async retweetPost(postId: number, userId: number) {
      const existingRetweet = await this.prisma.retweet.findUnique({
          where: { postId_userId: { postId, userId } },
      });
      if (existingRetweet) {
          throw new ForbiddenException('You have already retweeted this post.');
      }
      const retweet = await this.prisma.retweet.create({
          data: { postId, userId },
      });
      const postCacheKey = this.cacheKeyPostDetails(postId);
      const postCacheKeyAllPost = this.cacheKeyAllPosts;
      this.invalidateCache([postCacheKey, postCacheKeyAllPost])
  
      this.rabbitMQClient.emit('cache_update', {
        type: 'RETWEET_POST',
        postId,
        userId,
      });
      await this.notificationService.retweetPost(userId, retweet.postId);
      return retweet;
  }
  async deleteFeedPost(postId: number, userId: number) {
      const post = await this.prisma.feedPost.findUnique({
          where: { id: postId },
      });
      if (!post) {
          throw new NotFoundException('Post not found.');
      }

      if (post.userId !== userId) {
          throw new ForbiddenException('You are not authorized to delete this post.');
      }

      await this.prisma.feedPost.delete({ where: { id: postId } });

    this.clearCacheForPost(postId, userId);

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
  async getPostDetails(postId: number) {
      const cacheKey = this.cacheKeyPostDetails(postId);
      const cachedPost = await this.getCachedData<FeedPost>(cacheKey);
      if (cachedPost) {
          return cachedPost;
      }

      const post = await this.prisma.feedPost.findUnique({
          where: { id: postId },
          include: {
            user: { select: { id: true, name: true, picture: true } },
            likes: { select: { userId: true } },
            comments: {
              select: {
                id: true,
                content: true,
                createdAt: true,
                user: { select: { id: true, name: true, picture: true } },
              },
            },
            retweets: { select: { userId: true } },
          },
      });

      if (!post) {
          throw new NotFoundException('Post not found.');
      }
    await this.setCachedData(cacheKey, post);

      return post;
  }

  async getCommentPost(postId: number, skip = 0, take = this.defaultTake) {
      const comments = await this.prisma.feedPostComment.findMany({
          where: { postId },
          skip,
          take,
        include: {
            user: { select: { id: true, name: true, picture: true } },
          },
          orderBy: { createdAt: 'asc' },
      });
      return comments;
  }

  private async clearCacheForPost(postId: number, userId: number) {
      const postCacheKeyAllPost = this.cacheKeyAllPosts;
      const postCacheKeyUserPost = this.getCacheKey(this.cacheKeyUserPosts(userId));
    this.invalidateCache([postCacheKeyAllPost, postCacheKeyUserPost])
  }
}