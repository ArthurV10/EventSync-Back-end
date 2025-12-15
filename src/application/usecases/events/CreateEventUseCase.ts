import { IEventRepository } from '../../../domain/repositories/IEventRepository';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { AppError } from '../../../shared/errors/AppError';
import { Event, EventType } from '@prisma/client';

interface IRequest {
    organizer_id: string;
    title: string;
    description: string;
    start_date: Date;
    end_date: Date;
    location_address?: string;
    location_url?: string;
    price?: number;
    type?: EventType;
    requires_approval?: boolean;
    max_inscriptions?: number;
}

export class CreateEventUseCase {
    constructor(
        private eventRepository: IEventRepository,
        private userRepository: IUserRepository
    ) { }

    public async execute(data: IRequest): Promise<Event> {
        const user = await this.userRepository.findById(data.organizer_id);

        if (!user) {
            throw new AppError('User not found.');
        }

        // Opcional: Validar se user é ORGANIZER se houver essa regra estrita.
        // Por enquanto, qualquer user pode criar evento (conforme especificação "Seus Eventos").

        const event = await this.eventRepository.create({
            organizer: { connect: { id: data.organizer_id } },
            title: data.title,
            description: data.description,
            start_date: data.start_date,
            end_date: data.end_date,
            location_address: data.location_address,
            location_url: data.location_url,
            price: data.price,
            type: data.type,
            requires_approval: data.requires_approval,
            max_inscriptions: data.max_inscriptions,
            status: 'DRAFT', // Começa como Rascunho
        });

        return event;
    }
}
