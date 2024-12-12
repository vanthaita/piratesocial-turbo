import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  private client: Redis;

  constructor() {
    this.client = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: Number(process.env.REDIS_PORT) || 6379,
    });
  }

  getClient() {
    return this.client;
  }

  async checkConnection(): Promise<{ connected: boolean; cacheInfo?: string; keys?: string[] }> {
    try {
      const response = await this.client.ping();
      if (response !== 'PONG') {
        return { connected: false };
      }
      const info = await this.client.info();
      const cacheInfo = this.extractCacheInfo(info);
      const keys = await this.client.keys('*');
      return { connected: true, cacheInfo, keys };
    } catch (error) {
      console.error('Redis connection failed:', error);
      return { connected: false };
    }
  }

  private extractCacheInfo(info: string): string {
    const dbInfo = info.split('\n').find((line) => line.startsWith('db0:'));
    if (dbInfo) {
      return dbInfo;
    }
    return 'No cache data found';
  }
}
