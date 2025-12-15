import { Prisma, Checkin } from '@prisma/client';
import { prisma } from '../../../../main/config/prisma';
import { ICheckinRepository } from '../../../../domain/repositories/ICheckinRepository';

export class PrismaCheckinRepository implements ICheckinRepository {
    public async create(data: Prisma.CheckinCreateInput): Promise<Checkin> {
        return prisma.checkin.create({
            data,
        });
    }

    public async countByRegistrationId(registrationId: string): Promise<number> {
        return prisma.checkin.count({
            where: { registration_id: registrationId },
        });
    }

    public async findByRegistrationId(registrationId: string): Promise<Checkin[]> {
        return prisma.checkin.findMany({
            where: { registration_id: registrationId },
            orderBy: { timestamp: 'desc' }
        });
    }
}
