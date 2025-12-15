import { Registration, Prisma, RegistrationStatus } from '@prisma/client';

export interface IRegistrationRepository {
    create(data: Prisma.RegistrationCreateInput): Promise<Registration>;
    findById(id: string): Promise<Registration | null>;
    findByEventId(eventId: string): Promise<Registration[]>;
    findByUserAndEvent(userId: string, eventId: string): Promise<Registration | null>;
    updateStatus(id: string, status: RegistrationStatus): Promise<Registration>;
}
