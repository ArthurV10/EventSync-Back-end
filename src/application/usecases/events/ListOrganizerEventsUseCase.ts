import { IEventRepository } from '../../../domain/repositories/IEventRepository';
import { Event } from '@prisma/client';

export class ListOrganizerEventsUseCase {
    constructor(private eventRepository: IEventRepository) { }

    public async execute(organizerId: string): Promise<Event[]> {
        const events = await this.eventRepository.findByOrganizerId(organizerId);
        return events;
    }
}
