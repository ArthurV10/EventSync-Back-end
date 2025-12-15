import { Request, Response } from 'express';
import { CreateRegistrationUseCase } from '../../../application/usecases/registrations/CreateRegistrationUseCase';
import { ListEventRegistrationsUseCase } from '../../../application/usecases/registrations/ListEventRegistrationsUseCase';
import { ManageRegistrationStatusUseCase } from '../../../application/usecases/registrations/ManageRegistrationStatusUseCase';
import { PrismaRegistrationRepository } from '../../../infrastructure/persistence/prisma/repositories/PrismaRegistrationRepository';
import { PrismaEventRepository } from '../../../infrastructure/persistence/prisma/repositories/PrismaEventRepository';
import { PrismaNotificationRepository } from '../../../infrastructure/persistence/prisma/repositories/PrismaNotificationRepository';

export class RegistrationController {
    async create(request: Request, response: Response): Promise<Response> {
        const { eventId } = request.params;
        const userId = (request as any).user.id;

        const registrationRepository = new PrismaRegistrationRepository();
        const eventRepository = new PrismaEventRepository();
        const createRegistrationUseCase = new CreateRegistrationUseCase(registrationRepository, eventRepository);

        const registration = await createRegistrationUseCase.execute(userId, eventId);

        return response.status(201).json(registration);
    }

    async index(request: Request, response: Response): Promise<Response> {
        const { eventId } = request.params;
        const userId = (request as any).user.id;

        const registrationRepository = new PrismaRegistrationRepository();
        const eventRepository = new PrismaEventRepository();
        const listEventRegistrationsUseCase = new ListEventRegistrationsUseCase(registrationRepository, eventRepository);

        const registrations = await listEventRegistrationsUseCase.execute(eventId, userId);

        return response.json(registrations);
    }

    async approve(request: Request, response: Response): Promise<Response> {
        const { id } = request.params;
        const userId = (request as any).user.id; // Organizador

        const registrationRepository = new PrismaRegistrationRepository();
        const eventRepository = new PrismaEventRepository();
        const notificationRepository = new PrismaNotificationRepository();

        const manageRegistrationStatusUseCase = new ManageRegistrationStatusUseCase(registrationRepository, eventRepository, notificationRepository);

        const registration = await manageRegistrationStatusUseCase.execute(userId, id, 'APPROVE');

        return response.json(registration);
    }

    async reject(request: Request, response: Response): Promise<Response> {
        const { id } = request.params;
        const userId = (request as any).user.id;

        const registrationRepository = new PrismaRegistrationRepository();
        const eventRepository = new PrismaEventRepository();
        const notificationRepository = new PrismaNotificationRepository();

        const manageRegistrationStatusUseCase = new ManageRegistrationStatusUseCase(registrationRepository, eventRepository, notificationRepository);

        const registration = await manageRegistrationStatusUseCase.execute(userId, id, 'REJECT');

        return response.json(registration);
    }
}
