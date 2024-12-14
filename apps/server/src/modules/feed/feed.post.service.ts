import { Injectable, NotFoundException, ForbiddenException, Inject } from '@nestjs/common';
import { FeedPost, Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { ClientProxy } from '@nestjs/microservices';
import { RedisService } from '../redis/redis.service';
import { console } from 'inspector';
import { AwsS3Service } from '../aws/aws.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class FeedPostService {
  private readonly cacheKeyAllPosts = 'feed:allPosts';
  private readonly cacheKeyDiscoverPosts = 'feed:discover';
  private readonly cacheKeyUserPosts = (userId: number) => `feed:userPosts:${userId}`;
  private readonly cacheKeyPostComments = (postId: number) => `feed:postComments:${postId}`;
  private readonly cacheKeyPostDetails = (postId: number) => `feed:postDetails:${postId}`;
  constructor(
    private readonly prisma: PrismaService,
    private readonly redisService: RedisService,
    private readonly awsS3Service: AwsS3Service,
    private readonly notificationService: NotificationsService,
    @Inject('RABBITMQ_CLIENT') private readonly rabbitMQClient: ClientProxy,
  ) {}
  async getFeedAllPosts(skip = 0, take = 10) {
    const redisClient = this.redisService.getClient();
    const cacheKey = `${this.cacheKeyAllPosts}:${skip}:${take}`;
    
    const cachedData = await redisClient.get(cacheKey);
    console.log(cachedData);
    if (cachedData) {
      return JSON.parse(cachedData);
    }
  
    const posts = await this.prisma.feedPost.findMany({
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
  
    await redisClient.set(cacheKey, JSON.stringify(posts), 'EX', 60);  
  
    return posts;
  }
  async getDiscoverPosts(skip = 0, take = 10, currentUserId?: number) {
    const posts = await this.prisma.feedPost.findMany({
      include: {
        user: { select: { id: true, name: true, providerId: true, picture: true } },
        likes: true,
        comments: {
          select: {
            user: { select: { id: true, name: true, picture: true } },
            content: true,
          },
        },
        retweets: true,
      },
    });
  
    const now = Date.now();
  
      const scoredPosts = posts.map((post) => {
        const recencyScore = Math.max(
          0,
          7 - (now - new Date(post.createdAt).getTime()) / (1000 * 60 * 60 * 24)
        );
        const isMyPost = currentUserId ? post.user.id === currentUserId : false;
        const createdWithin5Minutes =
          now - new Date(post.createdAt).getTime() <= 5 * 60 * 1000;
    
        const priorityScore = isMyPost && createdWithin5Minutes ? 10 : 0;
    
        return {
          ...post,
          score:
            (post.likesCount || 0) * 2 +
            (post.comments?.length || 0) * 3 +
            (post.retweets?.length || 0) * 1 +
            recencyScore * 0.5 +
            priorityScore,
        };
      });
    
      scoredPosts.sort((a, b) => b.score - a.score);
    
    return scoredPosts.slice(skip, skip + take);
  }
  
  
  async getCachedDiscoverPosts(skip = 0, take = 10, currentUser?: number) {
    const redisKey = `${this.cacheKeyAllPosts}:${skip}:${take}`;
    const redisClient = this.redisService.getClient();
  
    try {
      const cachedData = await redisClient.get(redisKey);
      if (cachedData) {
        return JSON.parse(cachedData);
      }
    } catch (err) {
      console.error(`Error parsing cached data for key ${redisKey}:`, err);
    }
    const posts = await this.getDiscoverPosts(skip, take,currentUser);
    try {
      await redisClient.set(redisKey, JSON.stringify(posts), 'EX', 60);
    } catch (err) {
      console.error(`Error caching data for key ${redisKey}:`, err);
    }
    return posts;
  }
  
  
  async createFeedPost(data: Prisma.FeedPostCreateInput, userId: number, files?: Express.Multer.File[]) {
    const redisClient = this.redisService.getClient();
    console.log('Creating feed post...');
    console.log('Files received:', files);
    const imageUrls = files
      ? await Promise.all(
          files.map(async (file) =>
            this.awsS3Service.uploadImage(file.buffer, file.mimetype),
          ),
        )
      : [];
    console.log('Image URLs:', imageUrls);
  
    const newPost = await this.prisma.feedPost.create({
      data: { userId, content: data.content, imagesUrl: imageUrls || [] },
    });
    console.log('New post created:', newPost);
  
    const allPostKeys = await redisClient.keys(`${this.cacheKeyAllPosts}:*`);
    if (allPostKeys.length > 0) {
      console.log('Clearing all post keys from cache:', allPostKeys);
      await redisClient.del(allPostKeys);
    }
    console.log(`Clearing user post cache for userId: ${userId}`);
    await redisClient.del(this.cacheKeyUserPosts(userId));
    // console.log('Emitting cache_update event...');
    // this.rabbitMQClient.emit('cache_update', {
    //   type: 'CREATE_POST',
    //   userId,
    //   postId: newPost.id,
    // });
    await this.notificationService.notifyFollowers(userId, newPost.id, newPost.content);
    // console.log('cache_update event emitted successfully.');
    return newPost;
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
      await redisClient.set(postCacheKey, JSON.stringify(post), 'EX', 120); 
    }
    await redisClient.del(this.cacheKeyAllPosts);
    // this.rabbitMQClient.emit('cache_update', {
    //   type: 'LIKE_POST',
    //   postId,
    //   userId,
    // });
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
    await redisClient.set(cacheKey, JSON.stringify(post), 'EX', 120); 

    return post;
  }

  async getCommentPost(postId: number, skip = 0, take = 10) {
    const redisClient = this.redisService.getClient();
    const cacheKey = `${this.cacheKeyPostComments(postId)}:${skip}:${take}`;
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      return JSON.parse(cachedData);
    }
  
    const comments = await this.prisma.feedPostComment.findMany({
      where: { postId },
      skip,
      take,
      include: {
        user: { select: { id: true, name: true, providerId: true, picture: true } },
      },
      orderBy: { createdAt: 'asc' },
    });
  
    await redisClient.set(cacheKey, JSON.stringify(comments), 'EX', 60);
    console.log("Comment:", comments)
    return comments;
  }
  
  private async clearCacheForPost(postId: number, userId: number) {
    const redisClient = this.redisService.getClient();
    await redisClient.del(this.cacheKeyAllPosts);
    await redisClient.del(this.cacheKeyUserPosts(userId));
  }
}
