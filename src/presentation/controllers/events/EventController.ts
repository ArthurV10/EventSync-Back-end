import { Request, Response } from 'express';
import { z } from 'zod';
import { CreateEventUseCase } from '../../../application/usecases/events/CreateEventUseCase';
import { ListEventsUseCase } from '../../../application/usecases/events/ListEventsUseCase';
import { GetEventDetailsUseCase } from '../../../application/usecases/events/GetEventDetailsUseCase';
import { PrismaEventRepository } from '../../../infrastructure/persistence/prisma/repositories/PrismaEventRepository';
import { PrismaUserRepository } from '../../../infrastructure/persistence/prisma/repositories/PrismaUserRepository';

export class EventController {
    async create(request: Request, response: Response): Promise<Response> {
        const createEventSchema = z.object({
            title: z.string(),
            description: z.string(),
            start_date: z.coerce.date(),
            end_date: z.coerce.date(),
            location_address: z.string().optional(),
            location_url: z.string().optional(),
            price: z.number().optional(),
            type: z.enum(['FREE', 'PAID']).optional(),
            requires_approval: z.boolean().optional(),
            max_inscriptions: z.number().optional()
        });

        const data = createEventSchema.parse(request.body);

        const organizer_id = request.user.id;

        const eventRepository = new PrismaEventRepository();
        const userRepository = new PrismaUserRepository();
        const createEventUseCase = new CreateEventUseCase(eventRepository, userRepository);

        const event = await createEventUseCase.execute({
            ...data,
            organizer_id
        });

        return response.status(201).json(event);
    }

    async index(request: Request, response: Response): Promise<Response> {
        const eventRepository = new PrismaEventRepository();
        const listEventsUseCase = new ListEventsUseCase(eventRepository);

        const events = await listEventsUseCase.execute();

        return response.json(events);
    }

    async show(request: Request, response: Response): Promise<Response> {
        const { id } = request.params;
        const eventRepository = new PrismaEventRepository();
        const getEventDetailsUseCase = new GetEventDetailsUseCase(eventRepository);

        const event = await getEventDetailsUseCase.execute(id);

        return response.json(event);
    }
}
