import { forwardRef, Module } from "@nestjs/common";
import { NotificationsService } from "./notifications.service";
import { NotificationsController } from "./notification.controller";
import { RedisService } from "../redis/redis.service";
import { RedisModule } from "../redis/redis.module";
import { PrismaModule } from "src/prisma/prisma.module";
import { FollowService } from "../follow/follow.service";
import { FollowModule } from "../follow/follow.module";

@Module({
    imports: [PrismaModule, RedisModule, forwardRef(() => FollowModule)],
    controllers: [NotificationsController],
    providers: [NotificationsService, RedisService],
    exports: [NotificationsService]
})
export class NotificationsModule {}
