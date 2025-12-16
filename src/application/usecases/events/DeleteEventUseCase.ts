import { IEventRepository } from '../../../domain/repositories/IEventRepository';
import { AppError } from '../../../shared/errors/AppError';

interface IRequest {
    id: string;
    userId: string;
}

export class DeleteEventUseCase {
    constructor(private eventRepository: IEventRepository) { }

    public async execute({ id, userId }: IRequest): Promise<void> {
        const event = await this.eventRepository.findById(id);

        if (!event) {
            throw new AppError('Event not found.', 404);
        }

        if (event.organizer_id !== userId) {
            throw new AppError('You are not allowed to delete this event.', 403);
        }

        await this.eventRepository.delete(id);
    }
}
