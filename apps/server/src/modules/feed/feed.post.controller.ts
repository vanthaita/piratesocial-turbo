import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Param,
  Delete,
  Request,
  UseGuards,
} from '@nestjs/common';
import { FeedPostService } from './feed.post.service';
import { AuthGuard as JWTAuthGuard } from '../auth/auth.gaurd';
import { Request as ExpressRequest } from 'express';
@Controller('feed-posts')
export class FeedPostController {
  constructor(private readonly feedPostService: FeedPostService) {}

  @UseGuards(JWTAuthGuard)
  @Post()
  create(@Body() createFeedPostDto: any, @Request() req: ExpressRequest) {
    const userId = req.user?.id;
    console.log("newPost: ", userId);
    return this.feedPostService.createFeedPost(createFeedPostDto, userId);
  }

  @Get('all')
  getAllPosts(@Query('skip') skip = 0, @Query('take') take = 4) {
    return this.feedPostService.getFeedAllPosts(+skip, +take);
  }

  @UseGuards(JWTAuthGuard)
  @Get(':userId')
  getPosts(
    @Query('skip') skip = 0,
    @Query('take') take = 10,
    @Request() req: ExpressRequest,
  ) {
    const userId = req.user?.id;
    return this.feedPostService.getFeedPosts(userId, +skip, +take);
  }

  @UseGuards(JWTAuthGuard)
  @Post(':postId/like')
  likePost(@Param('postId') postId: number, @Request() req: any) {
    const userId = req.user?.id;
    return this.feedPostService.likePost(+postId, +userId);
  }
  @UseGuards(JWTAuthGuard)
  @Post(':postId/comment')
  comment(
    @Param('postId') postId: number,
    @Body('content') content: string,
    @Request() req: ExpressRequest,
  ) {
    const userId = req.user?.id;
    return this.feedPostService.commentOnPost(+postId, userId, content);
  }
  @UseGuards(JWTAuthGuard)
  @Post(':postId/retweet')
  retweet(@Param('postId') postId: number, @Request() req: ExpressRequest,) {
    const userId = req.user?.id;
    return this.feedPostService.retweetPost(+postId, userId);
  }

  @UseGuards(JWTAuthGuard)
  @Delete(':postId')
  delete(@Param('postId') postId: number, @Request() req: ExpressRequest,) {
    const userId = req.user?.id;
    return this.feedPostService.deleteFeedPost(+postId, userId);
  }
}
