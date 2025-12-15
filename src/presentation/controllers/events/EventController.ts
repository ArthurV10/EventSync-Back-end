import { Request, Response } from 'express';
import { CreateEventUseCase } from '../../../application/usecases/events/CreateEventUseCase';
import { ListEventsUseCase } from '../../../application/usecases/events/ListEventsUseCase';
import { GetEventDetailsUseCase } from '../../../application/usecases/events/GetEventDetailsUseCase';
import { ExportRegistrationsUseCase } from '../../../application/usecases/events/ExportRegistrationsUseCase';
import { PrismaEventRepository } from '../../../infrastructure/persistence/prisma/repositories/PrismaEventRepository';
import { PrismaUserRepository } from '../../../infrastructure/persistence/prisma/repositories/PrismaUserRepository';
import { PrismaRegistrationRepository } from '../../../infrastructure/persistence/prisma/repositories/PrismaRegistrationRepository';
import { z } from 'zod';

export class EventController {
    async create(request: Request, response: Response): Promise<Response> {
        const createEventBodySchema = z.object({
            title: z.string(),
            description: z.string(),
            location_address: z.string().optional(),
            location_url: z.string().optional(),
            start_date: z.string(),
            end_date: z.string(),
            price: z.number().optional(),
            type: z.enum(['FREE', 'PAID']).optional(),
            payment_info: z.string().optional(), // Novo campo
            max_inscriptions: z.number().optional(),
        });

        const data = createEventBodySchema.parse(request.body);
        const userId = (request as any).user.id;

        const eventRepository = new PrismaEventRepository();
        const userRepository = new PrismaUserRepository();
        const createEventUseCase = new CreateEventUseCase(eventRepository, userRepository);

        const event = await createEventUseCase.execute({
            ...data,
            start_date: new Date(data.start_date),
            end_date: new Date(data.end_date),
            organizer_id: userId
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

    async exportRegistrations(request: Request, response: Response): Promise<Response> {
        const { id } = request.params;
        const userId = (request as any).user.id;

        const registrationRepo = new PrismaRegistrationRepository();
        const eventRepo = new PrismaEventRepository();
        const useCase = new ExportRegistrationsUseCase(registrationRepo, eventRepo);

        const csvData = await useCase.execute(userId, id);

        response.header('Content-Type', 'text/csv');
        response.attachment(`registrations-${id}.csv`);
        return response.send(csvData);
    }
}
