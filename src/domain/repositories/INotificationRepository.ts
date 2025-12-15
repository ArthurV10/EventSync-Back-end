import { Notification, Prisma } from '@prisma/client';

export interface INotificationRepository {
    create(data: Prisma.NotificationCreateInput): Promise<Notification>;
    listByUser(userId: string): Promise<Notification[]>;
    markAsRead(notificationId: string): Promise<Notification>;
    countUnread(userId: string): Promise<number>;
}
