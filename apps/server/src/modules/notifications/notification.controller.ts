import { Body, Controller, Get,Param,Post,Request, UseGuards } from "@nestjs/common";
import { NotificationsService } from "./notifications.service";
import { AuthGuard as JWTAuthGuard } from '../auth/auth.gaurd';
import { Request as ExpressRequest } from 'express';
@Controller('notifications')
export class NotificationsController {
    constructor(
        private readonly notificationService: NotificationsService, 
    ) {}
    
    @UseGuards(JWTAuthGuard)
    @Post('mark-as-seen')
    async seenNotifications(
    @Request() req: ExpressRequest,
    @Body('notificationIds') notificationIds: number[]
    ) {
        const userId = req.user?.id;
        console.log('seen notifications', userId, notificationIds);
        if (!notificationIds || notificationIds.length === 0) {
            throw new Error("No notification IDs provided");
        }
        const response =  await this.notificationService.seenNotifications(userId, notificationIds);
        console.log(response);
        return response;
    }

    @UseGuards(JWTAuthGuard)
    @Get()
    getNotifications(
        @Request() req: ExpressRequest,
        @Param() skip = 0,
        @Param() take = 10
    ) {
        const userId = req.user?.id;
        return this.notificationService.getNotification(userId);
    }
}