import { INotificationRepository } from '../../../domain/repositories/INotificationRepository';
import { AppError } from '../../../shared/errors/AppError';
import { Notification } from '@prisma/client';

export class MarkNotificationReadUseCase {
    constructor(
        private notificationRepository: INotificationRepository
    ) { }

    public async execute(notificationId: string): Promise<Notification> {
        // Poderia validar se user é dono, mas por simplificação, assume-se que ID é suficiente ou adiciona validação depois.
        // Spec não detalha, mas boa prática. Deixarei simples pro MVP.
        return this.notificationRepository.markAsRead(notificationId);
    }
}
