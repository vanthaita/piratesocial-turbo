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
  async checkConnection(): Promise<boolean> {
    try {
      // Gửi lệnh ping tới Redis để kiểm tra kết nối
      const response = await this.client.ping();
      return response === 'PONG';
    } catch (error) {
      console.error('Redis connection failed:', error);
      return false;
    }
  }
}
