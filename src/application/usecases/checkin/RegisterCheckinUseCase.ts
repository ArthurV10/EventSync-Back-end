import { ICheckinRepository } from '../../../domain/repositories/ICheckinRepository';
import { IRegistrationRepository } from '../../../domain/repositories/IRegistrationRepository';
import { IEventRepository } from '../../../domain/repositories/IEventRepository';
import { AppError } from '../../../shared/errors/AppError';
import { Checkin } from '@prisma/client';

interface IRequest {
    registrationId: string;
    organizerId: string;
}

export class RegisterCheckinUseCase {
    constructor(
        private checkinRepository: ICheckinRepository,
        private registrationRepository: IRegistrationRepository,
        private eventRepository: IEventRepository
    ) { }

    public async execute({ registrationId, organizerId }: IRequest): Promise<Checkin> {
        const registration = await this.registrationRepository.findById(registrationId);

        if (!registration) {
            throw new AppError('Registration not found.', 404);
        }

        const event = await this.eventRepository.findById(registration.event_id);

        if (!event) {
            throw new AppError('Event not found.', 404);
        }

        // Validar se requisição vem do organizador
        if (event.organizer_id !== organizerId) {
            throw new AppError('Only the organizer can perform check-in.', 403);
        }

        // Validar status da inscrição
        if (registration.status !== 'APPROVED' && registration.status !== 'CONFIRMED') {
            throw new AppError('Cannot check-in: Registration not approved.');
        }

        // Validar limite de check-ins
        const checkinCount = await this.checkinRepository.countByRegistrationId(registrationId);

        if (checkinCount >= event.n_checkins_allowed) {
            throw new AppError(`Check-in limit reached (${event.n_checkins_allowed}).`);
        }

        const checkin = await this.checkinRepository.create({
            registration: { connect: { id: registrationId } },
            method: 'MANUAL', // Padrão
        });

        return checkin;
    }
}
