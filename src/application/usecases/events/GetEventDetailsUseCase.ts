import { IEventRepository } from '../../../domain/repositories/IEventRepository';
import { IRegistrationRepository } from '../../../domain/repositories/IRegistrationRepository';
import { AppError } from '../../../shared/errors/AppError';
import { Event } from '@prisma/client';

type EventDetailsResponse = Event & {
    isRegistered?: boolean;
    registrationStatus?: string;
};

export class GetEventDetailsUseCase {
    constructor(
        private eventRepository: IEventRepository,
        private registrationRepository?: IRegistrationRepository
    ) { }

    public async execute(id: string, userId?: string): Promise<EventDetailsResponse> {
        const event = await this.eventRepository.findById(id);

        if (!event) {
            throw new AppError('Event not found.', 404);
        }

        let isRegistered = false;
        let registrationStatus = undefined;

        if (userId && this.registrationRepository) {
            const registration = await this.registrationRepository.findByUserAndEvent(userId, id);
            if (registration) {
                isRegistered = true;
                registrationStatus = registration.status;
            }
        }

        return {
            ...event,
            isRegistered,
            registrationStatus
        };
    }
}
