import { IRegistrationRepository } from '../../../domain/repositories/IRegistrationRepository';
import { IEventRepository } from '../../../domain/repositories/IEventRepository';
import { AppError } from '../../../shared/errors/AppError';
import { Registration, RegistrationStatus } from '@prisma/client';

interface IRequest {
    registrationId: string;
    organizerId: string;
    status: RegistrationStatus; // APPROVED or REJECTED
}

export class ManageRegistrationStatusUseCase {
    constructor(
        private registrationRepository: IRegistrationRepository,
        private eventRepository: IEventRepository
    ) { }

    public async execute({ registrationId, organizerId, status }: IRequest): Promise<Registration> {
        const registration = await this.registrationRepository.findById(registrationId);

        if (!registration) {
            throw new AppError('Registration not found.', 404);
        }

        const event = await this.eventRepository.findById(registration.event_id);

        if (!event) {
            throw new AppError('Event associated with registration not found.', 404);
        }

        if (event.organizer_id !== organizerId) {
            throw new AppError('Only the organizer can manage registrations.', 403);
        }

        const updatedRegistration = await this.registrationRepository.updateStatus(registrationId, status);

        return updatedRegistration;
    }
}
