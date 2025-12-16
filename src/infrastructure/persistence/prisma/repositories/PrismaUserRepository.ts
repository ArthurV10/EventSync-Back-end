import { Prisma, User } from '@prisma/client';
import { prisma } from '../../../../main/config/prisma';
import { IUserRepository } from '../../../../domain/repositories/IUserRepository';

export class PrismaUserRepository implements IUserRepository {
    public async findByEmail(email: string): Promise<User | null> {
        const user = await prisma.user.findUnique({
            where: { email },
        });
        return user;
    }

    public async create(data: Prisma.UserCreateInput): Promise<User> {
        const user = await prisma.user.create({
            data,
        });
        return user;
    }

    public async findById(id: string): Promise<User | null> {
        const user = await prisma.user.findUnique({
            where: { id },
        });
        return user;
    }

    public async update(userId: string, data: Partial<User>): Promise<User> {
        const user = await prisma.user.update({
            where: { id: userId },
            data,
        });
        return user;
    }
}
