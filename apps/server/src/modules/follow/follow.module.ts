import { Module } from "@nestjs/common";
import { FollowController } from "./follow.controller";
import { FollowService } from "./follow.service";
import { RedisModule } from "../redis/redis.module";
import { PrismaModule } from "src/prisma/prisma.module";

@Module({
    imports: [RedisModule, PrismaModule],
    controllers: [FollowController],
    providers: [FollowService],
})
export class FollowModule {};