import { Injectable } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FollowService {
  private readonly cacheKeyUserFollowers = 'user:followers';
  private readonly cacheKeyUserFollowing = 'user:following';

  constructor(
    private readonly prisma: PrismaService,
    private readonly redisService: RedisService,
  ) {}

  async followUser(followerId: number, followeeId: number): Promise<void> {
    // Kiểm tra nếu người dùng đã theo dõi
    const redisClient = this.redisService.getClient();
    const existingFollow = await this.prisma.following.findUnique({
      where: {
        followerId_followeeId: { followerId, followeeId },
      },
    });
    console.log(existingFollow)
    if (existingFollow) {
      throw new Error('Already following this user');
    }

    // Thêm vào cơ sở dữ liệu
    await this.prisma.following.create({
      data: { followerId, followeeId },
    });

    // Cập nhật cache
    await redisClient.del(`${this.cacheKeyUserFollowers}:${followeeId}`);
    await redisClient.del(`${this.cacheKeyUserFollowing}:${followerId}`);
  }

  async unfollowUser(followerId: number, followeeId: number): Promise<void> {
    const redisClient = this.redisService.getClient();

    await this.prisma.following.delete({
      where: {
        followerId_followeeId: { followerId, followeeId },
      },
    });

    // Cập nhật cache
    await redisClient.del(`${this.cacheKeyUserFollowers}:${followeeId}`);
    await redisClient.del(`${this.cacheKeyUserFollowing}:${followerId}`);
  }

  async getFollowers(userId: number): Promise<number[]> {
    const redisClient = this.redisService.getClient();

    const cachedFollowers = await redisClient.get(
      `${this.cacheKeyUserFollowers}:${userId}`,
    );

    if (cachedFollowers) {
      return JSON.parse(cachedFollowers);
    }

    const followers = await this.prisma.following.findMany({
      where: { followeeId: userId },
      select: { followerId: true },
    });

    const followerIds = followers.map((f) => f.followerId);

    // Lưu cache
    await redisClient.set(
      `${this.cacheKeyUserFollowers}:${userId}`,
      JSON.stringify(followerIds),
      'EX',
      3600,
    );

    return followerIds;
  }
  async checkFollowStatus(followerId: number, followeeId: number) {
    const isFollowing = await this.prisma.following.findUnique({
      where: { followerId_followeeId: { followerId,followeeId  } },
    });
    return {isFollowing: !!isFollowing}
  }
}
