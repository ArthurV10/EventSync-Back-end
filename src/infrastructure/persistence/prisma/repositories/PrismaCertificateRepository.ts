import { Prisma, Certificate } from '@prisma/client';
import { prisma } from '../../../../main/config/prisma';
import { ICertificateRepository } from '../../../../domain/repositories/ICertificateRepository';

export class PrismaCertificateRepository implements ICertificateRepository {
    public async create(data: Prisma.CertificateCreateInput): Promise<Certificate> {
        return prisma.certificate.create({
            data,
        });
    }

    public async findByUserAndEvent(userId: string, eventId: string): Promise<Certificate | null> {
        return prisma.certificate.findUnique({
            where: {
                event_id_user_id: {
                    event_id: eventId,
                    user_id: userId
                }
            },
            include: {
                event: true,
                user: true
            }
        });
    }
}
