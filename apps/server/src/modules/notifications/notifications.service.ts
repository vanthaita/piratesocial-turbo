import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';
import { FollowService } from '../follow/follow.service';
import { PrismaService } from 'src/prisma/prisma.service';
import axios from 'axios';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly redisService: RedisService,
    @Inject(forwardRef(() => FollowService))
    private readonly followService: FollowService,
    private readonly prisma: PrismaService,
  ) {}

  async createNotification(userId: number, message: string, type: string) {
    return this.prisma.notification.create({
      data: {
        userId,
        message,
      },
    });
  }
  async getNotification(userId: number) {
    const [notifications, count] = await Promise.all([
      this.prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.notification.count({
        where: { userId },
      }),
    ]);
    return {
      notifications,
      count,
    };
  }
  async notifyFollowers(userId: number, postId: number, postContent: string, userName?: string) {
    const response = await axios.get(`http://localhost:3001/follow/followers`, {
      params: { userId },
    });
    const followers = response.data;
    const redisClient = this.redisService.getClient();

    for (const followerId of followers) {
      const message = `${userId} created a new post`;

      const messageToSave = {
        postId,
        message,
      };
      await this.createNotification(followerId, JSON.stringify(messageToSave), 'NewPost');
      redisClient.publish(
        `notifications:user:${followerId}`,
        JSON.stringify({
          messageToSave,
          userId,
          createAt: new Date().toISOString(),
        }),
      );
    }
  }

  async notifyPostOwner(userId: number, postId: number, action: 'Like' | 'Comment' | 'Retweet', postContent?: string) {
    const postOwner = await this.prisma.feedPost.findUnique({
      where: { id: postId },
      select: { userId: true },
    });

    if (!postOwner) {
      throw new Error('Post not found');
    }

    const redisClient = this.redisService.getClient();
    let message: string;

    switch (action) {
      case 'Like':
        message = `User ${userId} liked your post.`;
        break;
      case 'Comment':
        message = `User ${userId} commented on your post: ${postContent}`;
        break;
      case 'Retweet':
        message = `User ${userId} retweeted your post.`;
        break;
      default:
        throw new Error('Invalid action type');
    }

    const messageToSave = {
      postId,
      message,
    };
    await this.createNotification(postOwner.userId, JSON.stringify(messageToSave), action);
    redisClient.publish(
      `notifications:user:${postOwner.userId}`,
      JSON.stringify({
        messageToSave,
        userId,
        createAt: new Date().toISOString(),
      }),
    );
  }

  async likePost(userId: number, postId: number) {
    await this.notifyPostOwner(userId, postId, 'Like');
  }

  async commentPost(userId: number, postId: number, comment: string) {
    await this.notifyPostOwner(userId, postId, 'Comment', comment);
  }

  async retweetPost(userId: number, postId: number) {
    await this.notifyPostOwner(userId, postId, 'Retweet');
  }
}
