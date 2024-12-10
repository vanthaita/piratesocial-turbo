import { Controller, Get } from '@nestjs/common';
import { RedisService } from './redis.service';

@Controller('redis')
export class RedisController {
  constructor(private readonly redisService: RedisService) {}

  @Get('check')
  async checkRedisConnection() {
    const isConnected = await this.redisService.checkConnection();
    return { connected: isConnected };
  }
}