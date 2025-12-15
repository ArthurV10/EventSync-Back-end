import { IRegistrationRepository } from '../../../domain/repositories/IRegistrationRepository';
import { IEventRepository } from '../../../domain/repositories/IEventRepository';
import { AppError } from '../../../shared/errors/AppError';

export class ExportRegistrationsUseCase {
    constructor(
        private registrationRepository: IRegistrationRepository,
        private eventRepository: IEventRepository
    ) { }

    public async execute(organizerId: string, eventId: string): Promise<string> {
        const event = await this.eventRepository.findById(eventId);
        if (!event) {
            throw new AppError('Event not found.', 404);
        }

        if (event.organizer_id !== organizerId) {
            throw new AppError('You are not the organizer of this event.', 403);
        }

        const registrations = await this.registrationRepository.findByEventId(eventId) as any[];

        // Gerar CSV simples
        const header = 'Registration ID,User ID,User Name,User Email,Status,Created At\n';
        const rows = registrations.map((reg: any) => {
            return `${reg.id},${reg.user.id},"${reg.user.name}",${reg.user.email},${reg.status},${reg.created_at.toISOString()}`;
        }).join('\n');

        return header + rows;
    }
}
