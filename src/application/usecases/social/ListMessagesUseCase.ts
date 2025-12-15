import { IMessageRepository } from '../../../domain/repositories/IMessageRepository';
import { IFriendshipRepository } from '../../../domain/repositories/IFriendshipRepository';
import { AppError } from '../../../shared/errors/AppError';
import { Message } from '@prisma/client';

export class ListMessagesUseCase {
    constructor(
        private messageRepository: IMessageRepository,
        private friendshipRepository: IFriendshipRepository
    ) { }

    public async execute(userId: string, friendId: string): Promise<Message[]> {
        // Verificar amizade (ou pelo menos se users existem, mas vamos ser estritos)
        const friendship = await this.friendshipRepository.findByUsers(userId, friendId);

        if (!friendship || friendship.status !== 'ACCEPTED') {
            // Opcional: permitir ver histórico antigo mesmo se desfez amizade?
            // Spec diz: "Uma vez amigo, amizade válida mesmo após evento". E "Encerrar unilateralmente". 
            // Se encerrar, pode ver mensagens antigas? Normalmente sim.
            // Vamos permitir listar se já trocaram mensagens, ou bloquear?
            // Spec: "Mensagens avulsas: apenas entre amigos."
            // Seguirei a regra estrita: só amigos listam/trocam.
            throw new AppError('You can only view messages with friends.', 403);
        }

        const messages = await this.messageRepository.listConversation(userId, friendId);

        return messages;
    }
}
