import { Injectable, NotFoundException, ForbiddenException, Inject } from '@nestjs/common';
import { FeedPost, Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { ClientProxy } from '@nestjs/microservices';
import { RedisService } from '../redis/redis.service';
import { console } from 'inspector';
import { AwsS3Service } from '../aws/aws.service';

@Injectable()
export class FeedPostService {
  private readonly cacheKeyAllPosts = 'feed:allPosts';
  private readonly cacheKeyUserPosts = (userId: number) => `feed:userPosts:${userId}`;
  private readonly cacheKeyPostComments = (postId: number) => `feed:postComments:${postId}`;
  private readonly cacheKeyPostDetails = (postId: number) => `feed:postDetails:${postId}`;
  constructor(
    private readonly prisma: PrismaService,
    private readonly redisService: RedisService,
    private readonly awsS3Service: AwsS3Service,
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
  

  async createFeedPost(data: Prisma.FeedPostCreateInput, userId: number, files?: Express.Multer.File[]) {
    const redisClient = this.redisService.getClient();
    console.log("files: ", files);
    const imageUrls = files
      ? await Promise.all(
          files.map(async (file) =>
            this.awsS3Service.uploadImage(file.buffer, file.mimetype),
          ),
        )
      : [];
    console.log("image urls: ", imageUrls)
    const newPost = await this.prisma.feedPost.create({
      data: { userId, content: data.content, imagesUrl: imageUrls || [] },
    });
  
    const allPostKeys = await redisClient.keys(`${this.cacheKeyAllPosts}:*`);
    if (allPostKeys.length > 0) {
      await redisClient.del(allPostKeys);
    }
    await redisClient.del(this.cacheKeyUserPosts(userId));
  
    this.rabbitMQClient.emit('cache_update', {
      type: 'CREATE_POST',
      userId,
      postId: newPost.id,
    });
  
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

    await redisClient.del(this.cacheKeyAllPosts);

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

    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      return JSON.parse(cachedData);
    }

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

    return newComment;
  }

  async retweetPost(postId: number, userId: number) {
    const redisClient = this.redisService.getClient();

    const retweet = await this.prisma.retweet.upsert({
      where: { postId_userId: { postId, userId } },
      create: { postId, userId },
      update: {},
    });

    this.rabbitMQClient.emit('cache_update', {
      type: 'RETWEET_POST',
      postId,
      userId,
    });

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
