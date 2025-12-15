import { IFriendshipRepository } from '../../../domain/repositories/IFriendshipRepository';
import { AppError } from '../../../shared/errors/AppError';
import { Friendship } from '@prisma/client';

export class RespondFriendshipUseCase {
    constructor(
        private friendshipRepository: IFriendshipRepository
    ) { }

    public async execute(friendshipId: string, userId: string, action: 'ACCEPT' | 'REJECT'): Promise<Friendship> {
        const friendship = await this.friendshipRepository.findById(friendshipId);

        if (!friendship) {
            throw new AppError('Friendship request not found.', 404);
        }

        if (friendship.addressee_id !== userId) {
            throw new AppError('Not authorized to respond to this request.', 403);
        }

        if (friendship.status !== 'PENDING') {
            throw new AppError('Friendship request is not pending.');
        }

        const newStatus = action === 'ACCEPT' ? 'ACCEPTED' : 'REJECTED';

        const updatedFriendship = await this.friendshipRepository.updateStatus(friendshipId, newStatus);

        return updatedFriendship;
    }
}
