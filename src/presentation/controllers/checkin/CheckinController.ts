import { Request, Response } from 'express';
import { GetParticipantCardUseCase } from '../../../application/usecases/checkin/GetParticipantCardUseCase';
import { RegisterCheckinUseCase } from '../../../application/usecases/checkin/RegisterCheckinUseCase';
import { PrismaRegistrationRepository } from '../../../infrastructure/persistence/prisma/repositories/PrismaRegistrationRepository';
import { PrismaCheckinRepository } from '../../../infrastructure/persistence/prisma/repositories/PrismaCheckinRepository';
import { PrismaEventRepository } from '../../../infrastructure/persistence/prisma/repositories/PrismaEventRepository';

export class CheckinController {
    async getCard(request: Request, response: Response): Promise<Response> {
        const { registrationId } = request.params;
        const userId = request.user.id;

        const registrationRepository = new PrismaRegistrationRepository();
        const getParticipantCardUseCase = new GetParticipantCardUseCase(registrationRepository);

        const cardData = await getParticipantCardUseCase.execute(registrationId, userId);

        return response.json(cardData);
    }

    async create(request: Request, response: Response): Promise<Response> {
        const { eventId } = request.params; // Se rota for /events/:eventId/checkin
        const { registrationId } = request.body;
        const organizerId = request.user.id;

        const checkinRepository = new PrismaCheckinRepository();
        const registrationRepository = new PrismaRegistrationRepository();
        const eventRepository = new PrismaEventRepository();

        const registerCheckinUseCase = new RegisterCheckinUseCase(
            checkinRepository,
            registrationRepository,
            eventRepository
        );

        const checkin = await registerCheckinUseCase.execute({
            registrationId,
            organizerId
        });

        return response.status(201).json(checkin);
    }
}
