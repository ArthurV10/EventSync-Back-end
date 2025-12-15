import { Friendship, FriendshipStatus, Prisma } from '@prisma/client';

export interface IFriendshipRepository {
    create(data: Prisma.FriendshipCreateInput): Promise<Friendship>;
    findById(id: string): Promise<Friendship | null>;
    findByUsers(userId1: string, userId2: string): Promise<Friendship | null>;
    updateStatus(id: string, status: FriendshipStatus): Promise<Friendship>;
    listFriends(userId: string): Promise<Friendship[]>;
    listPendingRequests(userId: string): Promise<Friendship[]>;
}
