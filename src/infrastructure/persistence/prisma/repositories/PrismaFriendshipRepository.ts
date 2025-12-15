import { Prisma, Friendship, FriendshipStatus } from '@prisma/client';
import { prisma } from '../../../../main/config/prisma';
import { IFriendshipRepository } from '../../../../domain/repositories/IFriendshipRepository';

export class PrismaFriendshipRepository implements IFriendshipRepository {
    public async create(data: Prisma.FriendshipCreateInput): Promise<Friendship> {
        return prisma.friendship.create({
            data,
        });
    }

    public async findById(id: string): Promise<Friendship | null> {
        return prisma.friendship.findUnique({
            where: { id },
        });
    }

    public async findByUsers(userId1: string, userId2: string): Promise<Friendship | null> {
        // Busca amizade independente da ordem (requester/addressee)
        // Prisma não tem OR simples para pares de campos de forma direta tão bonita, mas vamos tentar findFirst com OR
        return prisma.friendship.findFirst({
            where: {
                OR: [
                    { requester_id: userId1, addressee_id: userId2 },
                    { requester_id: userId2, addressee_id: userId1 },
                ],
            },
        });
    }

    public async updateStatus(id: string, status: FriendshipStatus): Promise<Friendship> {
        return prisma.friendship.update({
            where: { id },
            data: { status },
        });
    }

    public async listFriends(userId: string): Promise<Friendship[]> {
        return prisma.friendship.findMany({
            where: {
                status: 'ACCEPTED',
                OR: [
                    { requester_id: userId },
                    { addressee_id: userId },
                ],
            },
            include: {
                requester: { select: { id: true, name: true, photo_url: true } },
                addressee: { select: { id: true, name: true, photo_url: true } },
            }
        });
    }

    public async listPendingRequests(userId: string): Promise<Friendship[]> {
        return prisma.friendship.findMany({
            where: {
                addressee_id: userId,
                status: 'PENDING',
            },
            include: {
                requester: { select: { id: true, name: true, photo_url: true } },
            }
        });
    }
}
