import { Request, Response } from 'express';
import { UpdateUserAvatarUseCase } from '../../../application/usecases/users/UpdateUserAvatarUseCase';
import { PrismaUserRepository } from '../../../infrastructure/persistence/prisma/repositories/PrismaUserRepository';

export class UserController {
    async updateAvatar(request: Request, response: Response): Promise<Response> {
        const userId = (request as any).user.id;
        const avatarFilename = request.file?.filename;

        if (!avatarFilename) {
            return response.status(400).json({ error: 'File missing' });
        }

        const userRepository = new PrismaUserRepository();
        const updateUserAvatarUseCase = new UpdateUserAvatarUseCase(userRepository);

        const user = await updateUserAvatarUseCase.execute({
            userId,
            avatarFilename,
        });

        // Retornar usuário sem senha
        const userResponse = {
            id: user.id,
            name: user.name,
            email: user.email,
            photo_url: user.photo_url, // Frontend precisará prepend a URL base
            role: user.role
        };

        return response.json(userResponse);
    }
}
