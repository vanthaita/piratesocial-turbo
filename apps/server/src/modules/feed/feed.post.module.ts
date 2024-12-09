import { Module } from "@nestjs/common";
import { FeedPostController } from "./feed.post.controller";
import { FeedPostService } from "./feed.post.service";
import { PrismaModule } from "../../prisma/prisma.module";

@Module({
    imports:[PrismaModule],
    controllers: [FeedPostController],
    providers: [FeedPostService],
})
export class FeedPostModule {}