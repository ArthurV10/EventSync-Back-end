import { Prisma, Notification } from '@prisma/client';
import { prisma } from '../../../../main/config/prisma';
import { INotificationRepository } from '../../../../domain/repositories/INotificationRepository';

export class PrismaNotificationRepository implements INotificationRepository {
    public async create(data: Prisma.NotificationCreateInput): Promise<Notification> {
        return prisma.notification.create({
            data,
        });
    }

    public async listByUser(userId: string): Promise<Notification[]> {
        return prisma.notification.findMany({
            where: { user_id: userId },
            orderBy: { created_at: 'desc' }
        });
    }

    public async markAsRead(notificationId: string): Promise<Notification> {
        return prisma.notification.update({
            where: { id: notificationId },
            data: { read: true }
        });
    }

    public async countUnread(userId: string): Promise<number> {
        return prisma.notification.count({
            where: { user_id: userId, read: false }
        });
    }
}
