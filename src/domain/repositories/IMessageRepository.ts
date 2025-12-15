import { Message, Prisma } from '@prisma/client';

export interface IMessageRepository {
    create(data: Prisma.MessageCreateInput): Promise<Message>;
    listConversation(userAId: string, userBId: string): Promise<Message[]>;
}
