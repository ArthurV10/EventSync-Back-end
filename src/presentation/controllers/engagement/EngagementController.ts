import { Request, Response } from 'express';
import { CreateReviewUseCase } from '../../../application/usecases/engagement/CreateReviewUseCase';
import { IssueCertificateUseCase } from '../../../application/usecases/engagement/IssueCertificateUseCase';
import { PrismaReviewRepository } from '../../../infrastructure/persistence/prisma/repositories/PrismaReviewRepository';
import { PrismaCertificateRepository } from '../../../infrastructure/persistence/prisma/repositories/PrismaCertificateRepository';
import { PrismaRegistrationRepository } from '../../../infrastructure/persistence/prisma/repositories/PrismaRegistrationRepository';
import { PrismaEventRepository } from '../../../infrastructure/persistence/prisma/repositories/PrismaEventRepository';
import { PrismaCheckinRepository } from '../../../infrastructure/persistence/prisma/repositories/PrismaCheckinRepository';

export class EngagementController {
    async createReview(request: Request, response: Response): Promise<Response> {
        const { eventId } = request.params;
        const { rating, comment } = request.body;
        const userId = request.user.id;

        const reviewRepo = new PrismaReviewRepository();
        const registrationRepo = new PrismaRegistrationRepository();
        const eventRepo = new PrismaEventRepository();
        const checkinRepo = new PrismaCheckinRepository();

        const useCase = new CreateReviewUseCase(reviewRepo, registrationRepo, eventRepo, checkinRepo);
        const review = await useCase.execute(userId, eventId, rating, comment);

        return response.status(201).json(review);
    }

    async issueCertificate(request: Request, response: Response): Promise<Response> {
        const { eventId } = request.params;
        const userId = request.user.id; // Ou pode passar userId no body se for admin gerando para usuário, mas UseCase assume user logado = participante.

        const certRepo = new PrismaCertificateRepository();
        const registrationRepo = new PrismaRegistrationRepository();
        const eventRepo = new PrismaEventRepository();
        const checkinRepo = new PrismaCheckinRepository();

        const useCase = new IssueCertificateUseCase(certRepo, registrationRepo, eventRepo, checkinRepo);
        const certificate = await useCase.execute(userId, eventId);

        return response.status(201).json(certificate);
    }
}
