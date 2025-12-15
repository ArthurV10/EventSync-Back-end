import { IRegistrationRepository } from '../../../domain/repositories/IRegistrationRepository';
import { IEventRepository } from '../../../domain/repositories/IEventRepository';
import { AppError } from '../../../shared/errors/AppError';
import { Registration } from '@prisma/client';

export class CreateRegistrationUseCase {
    constructor(
        private registrationRepository: IRegistrationRepository,
        private eventRepository: IEventRepository
    ) { }

    public async execute(userId: string, eventId: string): Promise<Registration> {
        const event = await this.eventRepository.findById(eventId);

        if (!event) {
            throw new AppError('Event not found.', 404);
        }

        // Verificar se já está inscrito
        const existingRegistration = await this.registrationRepository.findByUserAndEvent(userId, eventId);

        if (existingRegistration) {
            throw new AppError('User already registered for this event.');
        }

        // Verificar N Max de inscricoes (se houver)
        if (event.max_inscriptions) {
            const registrations = await this.registrationRepository.findByEventId(eventId);
            // Filtrar apenas inscrições ativas (não recusadas/canceladas)
            const activeRegistrations = registrations.filter(r => r.status !== 'REJECTED' && r.status !== 'CANCELED');

            if (activeRegistrations.length >= event.max_inscriptions) {
                throw new AppError('Event is full.');
            }
        }

        // Definição de status inicial
        let initialStatus: 'PENDING' | 'WAITING_PAYMENT' | 'APPROVED' = 'PENDING';

        if (event.type === 'PAID') {
            initialStatus = 'WAITING_PAYMENT';
        } else if (event.requires_approval) {
            initialStatus = 'PENDING';
        } else {
            // Gratuito e sem aprovação -> Aprovado direto
            initialStatus = 'APPROVED';
        }

        const registration = await this.registrationRepository.create({
            user: { connect: { id: userId } },
            event: { connect: { id: eventId } },
            status: initialStatus
        });

        return registration;
    }
}
