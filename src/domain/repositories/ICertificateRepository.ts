import { Certificate, Prisma } from '@prisma/client';

export interface ICertificateRepository {
    create(data: Prisma.CertificateCreateInput): Promise<Certificate>;
    findByUserAndEvent(userId: string, eventId: string): Promise<Certificate | null>;
}
