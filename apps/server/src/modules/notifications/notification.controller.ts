import { Controller, Get,Param,Request, UseGuards } from "@nestjs/common";
import { NotificationsService } from "./notifications.service";
import { AuthGuard as JWTAuthGuard } from '../auth/auth.gaurd';
import { Request as ExpressRequest } from 'express';
@Controller('notifications')
export class NotificationsController {
    constructor(
        private readonly notificationService: NotificationsService, 
    ) {}
    
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