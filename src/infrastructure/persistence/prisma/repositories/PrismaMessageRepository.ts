import { Prisma, Message } from '@prisma/client';
import { prisma } from '../../../../main/config/prisma';
import { IMessageRepository } from '../../../../domain/repositories/IMessageRepository';

export class PrismaMessageRepository implements IMessageRepository {
    public async create(data: Prisma.MessageCreateInput): Promise<Message> {
        return prisma.message.create({
            data,
        });
    }

    public async listConversation(userAId: string, userBId: string): Promise<Message[]> {
        return prisma.message.findMany({
            where: {
                OR: [
                    { sender_id: userAId, receiver_id: userBId },
                    { sender_id: userBId, receiver_id: userAId },
                ],
            },
            orderBy: { created_at: 'asc' },
        });
    }
}
