import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Inject,
} from '@nestjs/common';
import { FeedPost, Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { ClientProxy } from '@nestjs/microservices';
import { RedisService } from '../redis/redis.service';
import { AwsS3Service } from '../aws/aws.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class FeedPostService {
  private readonly cacheKeyAllPosts = 'feed:allPosts';
  private readonly cacheKeyDiscoverPosts = 'feed:discover';
  private readonly cacheKeyUserPosts = (userId: number) => `feed:userPosts:${userId}`;
  private readonly cacheKeyPostDetails = (postId: number) => `feed:postDetails:${postId}`;
  private readonly cacheKeyPostComments = (postId: number) => `feed:postComments:${postId}`;

  constructor(
    private readonly prisma: PrismaService,
    private readonly redisService: RedisService,
    private readonly awsS3Service: AwsS3Service,
    private readonly notificationService: NotificationsService,
    @Inject('RABBITMQ_CLIENT') private readonly rabbitMQClient: ClientProxy,
  ) {}

  private getCacheKey(prefix: string, skip: number, take: number): string {
    return `${prefix}:${skip}:${take}`;
  }
  async getFeedAllPosts(skip = 0, take = 10) {
    const redisClient = this.redisService.getClient();
    const cacheKey = this.getCacheKey(this.cacheKeyAllPosts, skip, take);

    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      return JSON.parse(cachedData);
    }

    const posts = await this.prisma.feedPost.findMany({
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, name: true, providerId: true, picture: true } },
        likes: true,
        comments: true,
        retweets: true,
      },
    });

    await redisClient.set(cacheKey, JSON.stringify(posts), 'EX', 120); 

    return posts;
  }
  async getDiscoverPosts(skip = 0, take = 10, currentUserId?: number) {
    const redisClient = this.redisService.getClient();
    const cacheKey = this.getCacheKey(this.cacheKeyDiscoverPosts, skip, take);

    try {
      const cachedData = await redisClient.get(cacheKey);
      if (cachedData) return JSON.parse(cachedData);
    } catch (err) {
      console.error(`Error retrieving cached data for key ${cacheKey}:`, err);
    }

    const posts = await this.prisma.feedPost.findMany({
      include: {
        user: { select: { id: true, name: true, picture: true } },
        likes: true,
        comments: true,
        retweets: true,
      },
    });
    const now = Date.now();
    const scoredPosts = posts.map((post) => {
      const recencyScore = Math.max(
        0,
        7 - (now - new Date(post.createdAt).getTime()) / (1000 * 60 * 60 * 24),
      );
      const isMyPost = currentUserId ? post.user.id === currentUserId : false;
      const priorityScore = isMyPost ? 10 : 0;

      return {
        ...post,
        score:
          (post.likes.length || 0) * 2 +
          (post.comments.length || 0) * 3 +
          recencyScore * 0.5 +
          priorityScore,
      };
    });

    scoredPosts.sort((a, b) => b.score - a.score);
    const paginatedPosts = scoredPosts.slice(skip, skip + take);

    try {
      await redisClient.set(cacheKey, JSON.stringify(paginatedPosts), 'EX', 120);
    } catch (err) {
      console.error(`Error caching data for key ${cacheKey}:`, err);
    }

    return paginatedPosts;
  }
  async createFeedPost(
    data: Prisma.FeedPostCreateInput,
    userId: number,
    files?: Express.Multer.File[],
  ) {
    const redisClient = this.redisService.getClient();

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

    await redisClient.del(this.getCacheKey(this.cacheKeyAllPosts, 0, 10));
    await redisClient.del(this.getCacheKey(this.cacheKeyDiscoverPosts, 0, 10));

    await this.notificationService.notifyFollowers(userId, newPost.id, newPost.content);

    return newPost;
  }

  async updatePostInCache(postId: number, updateData: Partial<FeedPost>) {
    const redisClient = this.redisService.getClient();

    const cacheKeys = await redisClient.keys(`feed:*:${postId}`);

    for (const key of cacheKeys) {
      try {
        const cachedData = await redisClient.get(key);
        if (cachedData) {
          const posts = JSON.parse(cachedData);
          const updatedPosts = posts.map((post) =>
            post.id === postId ? { ...post, ...updateData } : post,
          );
          await redisClient.set(key, JSON.stringify(updatedPosts), 'EX', 120);
        }
      } catch (err) {
        console.error(`Error updating cache for key ${key}:`, err);
      }
    }
  }
  
  async likePost(postId: number, userId: number) {
    const redisClient = this.redisService.getClient();
  
    const existingLike = await this.prisma.feedPostLike.findUnique({
      where: { postId_userId: { postId, userId } },
    });
    if (existingLike) {
      throw new ForbiddenException('Post already liked by this user.');
    }
    await this.prisma.feedPostLike.create({ data: { postId, userId } });
    const updatedPost = await this.prisma.feedPost.update({
      where: { id: postId },
      data: { likesCount: { increment: 1 } },
    });
    const postCacheKey = this.cacheKeyPostDetails(postId);
    const cachedPost = await redisClient.get(postCacheKey);
    if (cachedPost) {
      const post = JSON.parse(cachedPost);
      post.likesCount += 1;
      post.likes = [...(post.likes || []), { userId }];
      await redisClient.set(postCacheKey, JSON.stringify(post), 'EX', 60); 
    }
    await redisClient.del(this.cacheKeyAllPosts);
    await this.notificationService.likePost(userId, updatedPost.id);
    return updatedPost;
  }
  
  async getFeedPosts(userId: number, skip = 0, take = 10) {
    console.log('Fetching feed posts for user:', userId);
    const cacheKey = `feed:userPosts:${userId}:${skip}:${take}`;
    const redisClient = this.redisService.getClient();
  
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      console.log('Returning cached feed posts:', JSON.parse(cachedData));
      return JSON.parse(cachedData);
    }
  
    const followedUsers = await this.prisma.following.findMany({
      where: { followerId: userId },
      select: { followeeId: true },
    });
    console.log('Followed users:', followedUsers);
  
    const followedUserIds = followedUsers.map(f => f.followeeId);
    if (followedUserIds.length === 0) {
      console.warn('No followed users found.');
      return [];
    }
    const posts = await this.prisma.feedPost.findMany({
      where: { userId: { in: followedUserIds } },
      skip: skip,
      take: take,
      orderBy: { createdAt: 'desc' },
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
      distinct: ['id'],  
    });
    console.log('Fetched posts:', posts);
    await redisClient.set(cacheKey, JSON.stringify(posts), 'EX', 60);
    return posts;
  }

  async commentOnPost(postId: number, userId: number, content: string) {
    const redisClient = this.redisService.getClient();

    const newComment = await this.prisma.feedPostComment.create({
      data: { postId, userId, content },
    });

    await redisClient.del(this.cacheKeyPostComments(postId));

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
    const redisClient = this.redisService.getClient();
    const existingRetweet = await this.prisma.retweet.findUnique({
      where: { postId_userId: { postId, userId } },
    });
    if (existingRetweet) {
      throw new ForbiddenException('You have already retweeted this post.');
    }
    const retweet = await this.prisma.retweet.create({
      data: { postId, userId },
    });
    await redisClient.del(this.cacheKeyPostDetails(postId));
    await redisClient.del(this.cacheKeyAllPosts);
    this.rabbitMQClient.emit('cache_update', {
      type: 'RETWEET_POST',
      postId,
      userId,
    });
    await this.notificationService.retweetPost(userId, retweet.postId);
    return retweet;
  }
  async deleteFeedPost(postId: number, userId: number) {
    const redisClient = this.redisService.getClient();

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

    await redisClient.del(this.cacheKeyAllPosts);
    await redisClient.del(this.cacheKeyUserPosts(userId));

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
    const redisClient = this.redisService.getClient();
    const cacheKey = this.cacheKeyPostDetails(postId);
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      return JSON.parse(cachedData);
    }

    const post = await this.prisma.feedPost.findUnique({
      where: { id: postId },
      include: {
        user: { select: { id: true, name: true, providerId: true, picture: true } },
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
    await redisClient.set(cacheKey, JSON.stringify(post), 'EX', 60); 

    return post;
  }

  async getCommentPost(postId: number, skip = 0, take = 10) {
    // const redisClient = this.redisService.getClient();
    // const cacheKey = `${this.cacheKeyPostComments(postId)}:${skip}:${take}`;
    // const cachedData = await redisClient.get(cacheKey);
    // if (cachedData) {
    //   return JSON.parse(cachedData);
    // }
    const comments = await this.prisma.feedPostComment.findMany({
      where: { postId },
      skip,
      take,
      include: {
        user: { select: { id: true, name: true, providerId: true, picture: true } },
      },
      orderBy: { createdAt: 'asc' },
    });
    // await redisClient.set(cacheKey, JSON.stringify(comments), 'EX', 60);
    console.log("Comment:", comments)
    return comments;
  }
  
  private async clearCacheForPost(postId: number, userId: number) {
    const redisClient = this.redisService.getClient();
    await redisClient.del(this.cacheKeyAllPosts);
    await redisClient.del(this.cacheKeyUserPosts(userId));
  }
}
