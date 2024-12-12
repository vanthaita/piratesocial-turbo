import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { UserService } from '../user/user.service';

@Injectable()
export class SchedulerService {
  constructor(private readonly userService: UserService) {}

  @Cron('*/5 * * * *') // Every 5 minutes
  async handleCron(): Promise<void> {
    console.log('Running user status update job');
    await this.userService.updateUserStatus();
    console.log('User status update job completed');
  }
}
