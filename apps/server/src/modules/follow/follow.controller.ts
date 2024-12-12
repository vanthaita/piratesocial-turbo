import { Controller, Post, Delete, Param, ParseIntPipe, Get, UseGuards,Request } from '@nestjs/common';
import { FollowService } from './follow.service';
import { AuthGuard as JWTAuthGuard } from '../auth/auth.gaurd';
import { Request as ExpressRequest } from 'express';
@Controller('follow')
export class FollowController {
  constructor(private readonly followService: FollowService) {}

  @UseGuards(JWTAuthGuard)
  @Post(':followeeId')
  async followUser(
    @Param('followeeId', ParseIntPipe) followeeId: number,
    @Request() req: ExpressRequest
  ) {
    console.log('follow user: ' + followeeId);
    const followerId = req.user?.id;
    return this.followService.followUser(followerId, followeeId);
  }

  @UseGuards(JWTAuthGuard)
  @Delete(':followeeId')
  async unfollowUser(
    @Param('followeeId', ParseIntPipe) followeeId: number,
    @Request() req: ExpressRequest
  ) {
    console.log('Unfollow user: ' + followeeId);
    const followerId = req.user?.id;
    return this.followService.unfollowUser(followerId, followeeId);
  }
  @UseGuards(JWTAuthGuard)
  @Get(':followeeId')
  async checkFollowStatus(
    @Param('followeeId', ParseIntPipe) followeeId: number,
    @Request() req: ExpressRequest
  ) {
    const followerId = req.user?.id;
    return this.followService.checkFollowStatus(followerId, followeeId); 
  }
}
