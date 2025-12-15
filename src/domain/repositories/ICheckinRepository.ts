import { Checkin, Prisma } from '@prisma/client';

export interface ICheckinRepository {
    create(data: Prisma.CheckinCreateInput): Promise<Checkin>;
    countByRegistrationId(registrationId: string): Promise<number>;
    findByRegistrationId(registrationId: string): Promise<Checkin[]>;
}
