import { Request, Response } from 'express';
import { RequestFriendshipUseCase } from '../../../application/usecases/social/RequestFriendshipUseCase';
import { RespondFriendshipUseCase } from '../../../application/usecases/social/RespondFriendshipUseCase';
import { SendMessageUseCase } from '../../../application/usecases/social/SendMessageUseCase';
import { ListMessagesUseCase } from '../../../application/usecases/social/ListMessagesUseCase';
import { PrismaFriendshipRepository } from '../../../infrastructure/persistence/prisma/repositories/PrismaFriendshipRepository';
import { PrismaMessageRepository } from '../../../infrastructure/persistence/prisma/repositories/PrismaMessageRepository';
import { PrismaRegistrationRepository } from '../../../infrastructure/persistence/prisma/repositories/PrismaRegistrationRepository';
import { PrismaEventRepository } from '../../../infrastructure/persistence/prisma/repositories/PrismaEventRepository';

export class SocialController {
    async requestFriendship(request: Request, response: Response): Promise<Response> {
        const { eventId } = request.params;
        const { addresseeId } = request.body;
        const requesterId = request.user.id;

        const friendshipRepo = new PrismaFriendshipRepository();
        const registrationRepo = new PrismaRegistrationRepository();
        const eventRepo = new PrismaEventRepository();

        const useCase = new RequestFriendshipUseCase(friendshipRepo, registrationRepo, eventRepo);
        const friendship = await useCase.execute(requesterId, addresseeId, eventId);

        return response.status(201).json(friendship);
    }

    async respondFriendship(request: Request, response: Response): Promise<Response> {
        const { requestId } = request.params;
        const { action } = request.body; // ACCEPT or REJECT
        const userId = request.user.id;

        const friendshipRepo = new PrismaFriendshipRepository();
        const useCase = new RespondFriendshipUseCase(friendshipRepo);

        const friendship = await useCase.execute(requestId, userId, action);

        return response.json(friendship);
    }

    async sendMessage(request: Request, response: Response): Promise<Response> {
        const { receiverId, content } = request.body;
        const senderId = request.user.id;

        const messageRepo = new PrismaMessageRepository();
        const friendshipRepo = new PrismaFriendshipRepository();

        const useCase = new SendMessageUseCase(messageRepo, friendshipRepo);
        const message = await useCase.execute(senderId, receiverId, content);

        return response.status(201).json(message);
    }

    async listMessages(request: Request, response: Response): Promise<Response> {
        const { friendId } = request.params;
        const userId = request.user.id;

        const messageRepo = new PrismaMessageRepository();
        const friendshipRepo = new PrismaFriendshipRepository();

        const useCase = new ListMessagesUseCase(messageRepo, friendshipRepo);
        const messages = await useCase.execute(userId, friendId);

        return response.json(messages);
    }
}
