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
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { FeedPostService } from './feed.post.service';
import { AuthGuard as JWTAuthGuard } from '../auth/auth.gaurd';
import { Request as ExpressRequest } from 'express';
import { FilesInterceptor } from '@nestjs/platform-express';
@Controller('feed-posts')
export class FeedPostController {
  constructor(private readonly feedPostService: FeedPostService) {}

  @UseGuards(JWTAuthGuard)
  @Post()
  @UseInterceptors(FilesInterceptor('images'))
  create(@Body() createFeedPostDto: any, @Request() req: ExpressRequest,@UploadedFiles() files: Express.Multer.File[]) {
    const userId = req.user?.id;
    return this.feedPostService.createFeedPost(createFeedPostDto, userId, files);
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
  retweet(@Param('postId') postId: number, @Request() req: ExpressRequest) {
    const userId = req.user?.id;
    return this.feedPostService.retweetPost(+postId, userId);
  }
  @UseGuards(JWTAuthGuard)
  @Get(':postId/liked')
  async hasUserLikedPost(@Param('postId') postId: number, @Request() req: ExpressRequest): Promise<{ liked: boolean }> {
    const userId = req.user?.id;
    const liked = await this.feedPostService.hasUserLikedPost(+postId, +userId);
    return { liked };
  }
  @UseGuards(JWTAuthGuard)
  @Delete(':postId')
  delete(@Param('postId') postId: number, @Request() req: ExpressRequest,) {
    const userId = req.user?.id;
    return this.feedPostService.deleteFeedPost(+postId, userId);
  }
  // @UseGuards(JWTAuthGuard)
  @Get(':postId/details')
  getDetailsPost(@Param('postId') postId: number) {
    // const userId = req.user?.id;
    return this.feedPostService.getPostDetails(+postId);
  }
  // @UseGuards(JWTAuthGuard)
  @Get(':postId/comments/details')
  async geCommentPost(@Param('postId') postId: number, 
    @Query('skip') skip = 0,
    @Query('take') take = 10,
  ) {
    return await this.feedPostService.getCommentPost(+postId, +skip, +take);
  }
}
