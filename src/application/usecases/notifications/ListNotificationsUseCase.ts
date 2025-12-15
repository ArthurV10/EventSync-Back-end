import { INotificationRepository } from '../../../domain/repositories/INotificationRepository';
import { Notification } from '@prisma/client';

export class ListNotificationsUseCase {
    constructor(
        private notificationRepository: INotificationRepository
    ) { }

    public async execute(userId: string): Promise<Notification[]> {
        return this.notificationRepository.listByUser(userId);
    }
}
