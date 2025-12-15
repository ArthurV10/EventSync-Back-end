import { IEventRepository } from '../../../domain/repositories/IEventRepository';
import { AppError } from '../../../shared/errors/AppError';
import { Event } from '@prisma/client';

export class GetEventDetailsUseCase {
    constructor(private eventRepository: IEventRepository) { }

    public async execute(id: string): Promise<Event> {
        const event = await this.eventRepository.findById(id);

        if (!event) {
            throw new AppError('Event not found.', 404);
        }

        return event;
    }
}
