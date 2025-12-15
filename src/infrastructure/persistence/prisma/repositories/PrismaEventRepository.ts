import { Prisma, Event } from '@prisma/client';
import { prisma } from '../../../../main/config/prisma';
import { IEventRepository } from '../../../../domain/repositories/IEventRepository';

export class PrismaEventRepository implements IEventRepository {
    public async create(data: Prisma.EventCreateInput): Promise<Event> {
        const event = await prisma.event.create({
            data,
        });
        return event;
    }

    public async findById(id: string): Promise<Event | null> {
        const event = await prisma.event.findUnique({
            where: { id },
            include: {
                organizer: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        photo_url: true,
                        rating_organizer: true
                    }
                }
            }
        });
        return event;
    }

    public async findAll(): Promise<Event[]> {
        const events = await prisma.event.findMany({
            orderBy: {
                created_at: 'desc'
            },
            include: {
                organizer: {
                    select: {
                        name: true
                    }
                }
            }
        });
        return events;
    }

    public async update(id: string, data: Prisma.EventUpdateInput): Promise<Event> {
        const event = await prisma.event.update({
            where: { id },
            data,
        });
        return event;
    }
}
