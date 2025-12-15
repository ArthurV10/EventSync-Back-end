import { Event, Prisma } from '@prisma/client';

export interface IEventRepository {
    create(data: Prisma.EventCreateInput): Promise<Event>;
    findById(id: string): Promise<Event | null>;
    findAll(): Promise<Event[]>;
    update(id: string, data: Prisma.EventUpdateInput): Promise<Event>;
}
