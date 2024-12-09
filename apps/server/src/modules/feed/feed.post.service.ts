import { Injectable } from '@nestjs/common';
import { FeedPost, Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class FeedPostService {
  constructor(private readonly prisma: PrismaService) {}

  async createFeedPost(data: FeedPost, userId: number) {
    return this.prisma.feedPost.create(
      {
        data: {
          userId: userId,
          ...data,
        }
      }
    );
  }

  async getFeedPosts(userId: number, skip = 0, take = 10) {
    return this.prisma.feedPost.findMany({
      where: { userId },
      skip,
      take,
      include: {
        user: true,
        likes: true,
        comments: { take: 5 },
        
      },
    });
  }
  async getFeedAllPosts(skip = 0, take = 20) {
    const feedPosts = await this.prisma.feedPost.findMany({
      skip,
      take,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            providerId: true,
            picture: true,
          },
        },
        likes: {
          orderBy: {
            createdAt: 'desc',
          },
        },
        comments: {
          orderBy: {
            createdAt: 'desc',
          },
        },
        retweets: true,
      },
    });
    const feedPostsWithCounts = await Promise.all(
      feedPosts.map(async (post) => {
        const [likesCount, commentsCount, retweetsCount] = await Promise.all([
          this.prisma.feedPostLike.count({ where: { postId: post.id } }),
          this.prisma.feedPostComment.count({ where: { postId: post.id } }),
          this.prisma.retweet.count({ where: { postId: post.id } }),
        ]);
        return {
          ...post,
          likesCount,
          commentsCount,
          retweetsCount,
        };
      })
    );
  
    return feedPostsWithCounts;
  }
  
  
  
  
  async getTrendingPosts(skip = 0, take = 10) {
    return this.prisma.feedPost.findMany({
      skip,
      take,
      orderBy: {
        likesCount: 'desc',
      },
    });
  }

  async likePost(postId: number, userId: number) {
    await this.prisma.feedPostLike.create({
      data: { postId, userId },
    });
    return this.prisma.feedPost.update({
      where: { id: postId },
      data: { likesCount: { increment: 1 } },
    });
  }

  async commentOnPost(postId: number, userId: number, content: string) {
    return this.prisma.feedPostComment.create({
      data: { postId, userId, content },
    });
  }

  async deleteFeedPost(postId: number) {
    return this.prisma.feedPost.delete({ where: { id: postId } });
  }
}
