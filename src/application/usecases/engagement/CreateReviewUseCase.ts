import { IReviewRepository } from '../../../domain/repositories/IReviewRepository';
import { IRegistrationRepository } from '../../../domain/repositories/IRegistrationRepository';
import { IEventRepository } from '../../../domain/repositories/IEventRepository';
import { ICheckinRepository } from '../../../domain/repositories/ICheckinRepository';
import { AppError } from '../../../shared/errors/AppError';
import { Review } from '@prisma/client';

export class CreateReviewUseCase {
    constructor(
        private reviewRepository: IReviewRepository,
        private registrationRepository: IRegistrationRepository,
        private eventRepository: IEventRepository,
        private checkinRepository: ICheckinRepository
    ) { }

    public async execute(userId: string, eventId: string, rating: number, comment?: string): Promise<Review> {
        const event = await this.eventRepository.findById(eventId);
        if (!event) {
            throw new AppError('Event not found.', 404);
        }

        if (event.status !== 'FINISHED') {
            throw new AppError('You can only review finished events.');
        }

        // Verificar inscrição
        const registration = await this.registrationRepository.findByUserAndEvent(userId, eventId);
        if (!registration) {
            throw new AppError('You are not registered for this event.', 403);
        }

        // Spec diz: "participantes que fizeram check-in podem avaliar"
        // Verificar check-in
        const checkinCount = await this.checkinRepository.countByRegistrationId(registration.id);
        if (checkinCount < 1) {
            throw new AppError('You must have checked-in to review this event.', 403);
        }

        // Verificar se já avaliou
        const existingReview = await this.reviewRepository.findByUserAndEvent(userId, eventId);
        if (existingReview) {
            throw new AppError('You have already reviewed this event.');
        }

        if (rating < 1 || rating > 5) {
            throw new AppError('Rating must be between 1 and 5.');
        }

        const review = await this.reviewRepository.create({
            user: { connect: { id: userId } },
            event: { connect: { id: eventId } },
            rating,
            comment
        });

        return review;
    }
}
