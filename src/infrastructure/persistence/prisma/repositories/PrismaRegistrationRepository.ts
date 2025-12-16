import { Prisma, Registration, RegistrationStatus } from '@prisma/client';
import { prisma } from '../../../../main/config/prisma';
import { IRegistrationRepository } from '../../../../domain/repositories/IRegistrationRepository';

export class PrismaRegistrationRepository implements IRegistrationRepository {
    public async create(data: Prisma.RegistrationCreateInput): Promise<Registration> {
        return prisma.registration.create({
            data,
        });
    }

    public async findById(id: string): Promise<Registration | null> {
        return prisma.registration.findUnique({
            where: { id },
            include: {
                user: { select: { id: true, name: true, email: true } },
                event: { select: { id: true, title: true } }
            }
        });
    }

    public async findByEventId(eventId: string): Promise<Registration[]> {
        return prisma.registration.findMany({
            where: { event_id: eventId },
            include: {
                user: { select: { id: true, name: true, email: true, photo_url: true } }
            },
            orderBy: { created_at: 'desc' }
        });
    }

    public async findByUserAndEvent(userId: string, eventId: string): Promise<Registration | null> {
        return prisma.registration.findUnique({
            where: {
                event_id_user_id: {
                    event_id: eventId,
                    user_id: userId,
                },
            },
        });
    }

    public async findByUserId(userId: string): Promise<Registration[]> {
        return prisma.registration.findMany({
            where: { user_id: userId },
            include: {
                event: true,
                user: { select: { id: true, name: true, email: true } }
            },
            orderBy: { created_at: 'desc' }
        });
    }

    public async updateStatus(id: string, status: RegistrationStatus): Promise<Registration> {
        return prisma.registration.update({
            where: { id },
            data: { status },
        });
    }

    public async delete(id: string): Promise<void> {
        await prisma.registration.delete({
            where: { id },
        });
    }
}
