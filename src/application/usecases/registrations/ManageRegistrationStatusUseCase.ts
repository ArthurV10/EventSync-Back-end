import { IRegistrationRepository } from '../../../domain/repositories/IRegistrationRepository';
import { IEventRepository } from '../../../domain/repositories/IEventRepository';
import { AppError } from '../../../shared/errors/AppError';
import { Registration, RegistrationStatus } from '@prisma/client';
import { INotificationRepository } from '../../../domain/repositories/INotificationRepository';

export class ManageRegistrationStatusUseCase {
    constructor(
        private registrationRepository: IRegistrationRepository,
        private eventRepository: IEventRepository,
        private notificationRepository: INotificationRepository
    ) { }

    public async execute(organizerId: string, registrationId: string, action: 'APPROVE' | 'REJECT'): Promise<Registration> {
        const registration = await this.registrationRepository.findById(registrationId);
        if (!registration) {
            throw new AppError('Registration not found.', 404);
        }

        const event = await this.eventRepository.findById(registration.event_id);
        if (!event) {
            throw new AppError('Event not found.', 404);
        }

        if (event.organizer_id !== organizerId) {
            throw new AppError('You are not the organizer of this event.', 403);
        }

        /* 
           Regra simples: APPROVE -> APPROVED
           REJECT -> REJECTED
        */

        let newStatus: RegistrationStatus;

        if (action === 'APPROVE') {
            newStatus = 'APPROVED';
            // Verificar capacidade se necessário, mas aqui é gestão manual. Supondo que organizador controla.
        } else {
            newStatus = 'REJECTED';
        }

        const updatedRegistration = await this.registrationRepository.updateStatus(registrationId, newStatus);

        // Criar Notificação
        await this.notificationRepository.create({
            user: { connect: { id: registration.user_id } },
            title: `Registration ${action === 'APPROVE' ? 'Approved' : 'Rejected'}`,
            content: `Your registration for "${event.title}" has been ${action === 'APPROVE' ? 'approved' : 'rejected'}.`,
            read: false
        });

        return updatedRegistration;
    }
}
