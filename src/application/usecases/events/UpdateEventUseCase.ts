import { IEventRepository } from '../../../domain/repositories/IEventRepository';
import { AppError } from '../../../shared/errors/AppError';
import { Event, Prisma } from '@prisma/client';

interface IRequest {
    id: string;
    userId: string;
    data: Prisma.EventUpdateInput;
}

export class UpdateEventUseCase {
    constructor(private eventRepository: IEventRepository) { }

    public async execute({ id, userId, data }: IRequest): Promise<Event> {
        const event = await this.eventRepository.findById(id);

        if (!event) {
            throw new AppError('Event not found.', 404);
        }

        if (event.organizer_id !== userId) {
            throw new AppError('You are not allowed to edit this event.', 403);
        }

        const updatedEvent = await this.eventRepository.update(id, data);

        return updatedEvent;
    }
}
