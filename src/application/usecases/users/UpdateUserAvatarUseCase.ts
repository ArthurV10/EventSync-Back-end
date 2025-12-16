import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { AppError } from '../../../shared/errors/AppError';
import { User } from '@prisma/client';
import path from 'path';
import fs from 'fs';
import uploadConfig from '../../../main/config/upload';

interface IRequest {
    userId: string;
    avatarFilename: string;
}

export class UpdateUserAvatarUseCase {
    constructor(private userRepository: IUserRepository) { }

    public async execute({ userId, avatarFilename }: IRequest): Promise<User> {
        const user = await this.userRepository.findById(userId);

        if (!user) {
            throw new AppError('Only authenticated users can change avatar.', 401);
        }

        if (user.photo_url) {
            // Deletar avatar anterior se existir
            const userAvatarFilePath = path.join(uploadConfig.directory, user.photo_url);
            const userAvatarFileExists = await fs.promises.stat(userAvatarFilePath).catch(() => false);

            if (userAvatarFileExists) {
                await fs.promises.unlink(userAvatarFilePath);
            }
        }

        const updatedUser = await this.userRepository.update(userId, {
            photo_url: avatarFilename,
        });

        return updatedUser;
    }
}
