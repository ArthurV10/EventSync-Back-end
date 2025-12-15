import { IEventRepository } from '../../../domain/repositories/IEventRepository';
import { Event } from '@prisma/client';

export class ListEventsUseCase {
    constructor(private eventRepository: IEventRepository) { }

    public async execute(): Promise<Event[]> {
        // Futuro: Adicionar filtros
        const events = await this.eventRepository.findAll();

        // Filtrar apenas PUBLISHED | INSCRIPTIONS_OPEN | ONGOING na listagem pública
        // Por enquanto retorna tudo para facilitar dev, depois filtrar no repo.
        return events;
    }
}
