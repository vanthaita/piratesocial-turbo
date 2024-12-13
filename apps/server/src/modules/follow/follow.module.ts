import { forwardRef, Module } from "@nestjs/common";
import { FollowController } from "./follow.controller";
import { FollowService } from "./follow.service";
import { RedisModule } from "../redis/redis.module";
import { PrismaModule } from "src/prisma/prisma.module";
import { NotificationsModule } from "../notifications/notifications.module";

@Module({
    imports: [RedisModule, PrismaModule, forwardRef(() => NotificationsModule)],
    controllers: [FollowController],
    providers: [FollowService],
    exports: [FollowService]
})
export class FollowModule {};