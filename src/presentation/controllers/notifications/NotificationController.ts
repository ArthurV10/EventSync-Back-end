import { Request, Response } from 'express';
import { ListNotificationsUseCase } from '../../../application/usecases/notifications/ListNotificationsUseCase';
import { MarkNotificationReadUseCase } from '../../../application/usecases/notifications/MarkNotificationReadUseCase';
import { PrismaNotificationRepository } from '../../../infrastructure/persistence/prisma/repositories/PrismaNotificationRepository';

export class NotificationController {
    async list(request: Request, response: Response): Promise<Response> {
        const userId = (request as any).user.id;
        const repo = new PrismaNotificationRepository();
        const useCase = new ListNotificationsUseCase(repo);
        const notifications = await useCase.execute(userId);
        return response.json(notifications);
    }

    async markAsRead(request: Request, response: Response): Promise<Response> {
        const { id } = request.params;
        const repo = new PrismaNotificationRepository();
        const useCase = new MarkNotificationReadUseCase(repo);
        const notification = await useCase.execute(id);
        return response.json(notification);
    }
}
