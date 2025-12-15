import { Review, Prisma } from '@prisma/client';

export interface IReviewRepository {
    create(data: Prisma.ReviewCreateInput): Promise<Review>;
    findByEventId(eventId: string): Promise<Review[]>;
    findByUserAndEvent(userId: string, eventId: string): Promise<Review | null>;
}
