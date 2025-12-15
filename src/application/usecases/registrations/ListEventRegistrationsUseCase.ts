import { IRegistrationRepository } from '../../../domain/repositories/IRegistrationRepository';
import { IEventRepository } from '../../../domain/repositories/IEventRepository';
import { AppError } from '../../../shared/errors/AppError';
import { Registration } from '@prisma/client';

export class ListEventRegistrationsUseCase {
    constructor(
        private registrationRepository: IRegistrationRepository,
        private eventRepository: IEventRepository
    ) { }

    public async execute(eventId: string, userId: string): Promise<Registration[]> {
        const event = await this.eventRepository.findById(eventId);

        if (!event) {
            throw new AppError('Event not found.', 404);
        }

        if (event.organizer_id !== userId) {
            throw new AppError('Only the organizer can view registrations list.', 403);
        }

        const registrations = await this.registrationRepository.findByEventId(eventId);

        return registrations;
    }
}
