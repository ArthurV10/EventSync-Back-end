import { IMessageRepository } from '../../../domain/repositories/IMessageRepository';
import { IFriendshipRepository } from '../../../domain/repositories/IFriendshipRepository';
import { AppError } from '../../../shared/errors/AppError';
import { Message } from '@prisma/client';

export class SendMessageUseCase {
    constructor(
        private messageRepository: IMessageRepository,
        private friendshipRepository: IFriendshipRepository
    ) { }

    public async execute(senderId: string, receiverId: string, content: string): Promise<Message> {
        // Verificar amizade
        const friendship = await this.friendshipRepository.findByUsers(senderId, receiverId);

        if (!friendship || friendship.status !== 'ACCEPTED') {
            throw new AppError('You can only send messages to friends.', 403);
        }

        const message = await this.messageRepository.create({
            sender: { connect: { id: senderId } },
            receiver: { connect: { id: receiverId } },
            content
        });

        return message;
    }
}
