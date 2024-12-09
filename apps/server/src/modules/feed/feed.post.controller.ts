import { Controller, Get, Post, Body, Query, Param, Delete, Request, UseGuards } from '@nestjs/common';
import { FeedPostService } from './feed.post.service';
import { Response, Request as ExpressRequest } from 'express';
import { AuthGuard as JWTAuthGuard } from '../auth/auth.gaurd';

@Controller('feed-posts')
export class FeedPostController {
  constructor(private readonly feedPostService: FeedPostService) {}

  @UseGuards(JWTAuthGuard)
  @Post()
  create(@Body() createFeedPostDto: any, @Request() req: ExpressRequest) {
    const userId = req.user?.id;
    return this.feedPostService.createFeedPost(createFeedPostDto, userId);
  }

  @Get('all')
  getAllPosts(
    @Query('skip') skip = 0,
    @Query('take') take = 20,
  ) {
    return this.feedPostService.getFeedAllPosts(+skip, +take);
  }
  @UseGuards(JWTAuthGuard)
  @Get(':userId')
    getPosts(
      @Query('skip') skip = 0,
      @Query('take') take = 10,
      @Request() req: ExpressRequest
    ) {
      const userId = req.user?.id;
      return this.feedPostService.getFeedPosts(+userId, +skip, +take);
  }
  @Post(':postId/like')
  likePost(@Param('postId') postId: number, @Body('userId') userId: number) {
    return this.feedPostService.likePost(postId, userId);
  }

  @Post(':postId/comment')
  comment(
    @Param('postId') postId: number,
    @Body('userId') userId: number,
    @Body('content') content: string,
  ) {
    return this.feedPostService.commentOnPost(postId, userId, content);
  }

  @Delete(':postId')
  delete(@Param('postId') postId: number) {
    return this.feedPostService.deleteFeedPost(postId);
  }
}
