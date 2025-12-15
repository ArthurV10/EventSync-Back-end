import { Prisma, Review } from '@prisma/client';
import { prisma } from '../../../../main/config/prisma';
import { IReviewRepository } from '../../../../domain/repositories/IReviewRepository';

export class PrismaReviewRepository implements IReviewRepository {
    public async create(data: Prisma.ReviewCreateInput): Promise<Review> {
        return prisma.review.create({
            data,
        });
    }

    public async findByEventId(eventId: string): Promise<Review[]> {
        return prisma.review.findMany({
            where: { event_id: eventId },
            include: {
                user: { select: { id: true, name: true, photo_url: true } }
            },
            orderBy: { created_at: 'desc' }
        });
    }

    public async findByUserAndEvent(userId: string, eventId: string): Promise<Review | null> {
        return prisma.review.findUnique({
            where: {
                event_id_user_id: {
                    event_id: eventId,
                    user_id: userId
                }
            }
        });
    }
}
