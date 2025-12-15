import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IHashProvider } from '../../providers/IHashProvider';
import { AppError } from '../../../shared/errors/AppError';
import { User, Role } from '@prisma/client';

interface IRequest {
    name: string;
    email: string;
    password: string;
    city?: string;
    role?: Role;
}

export class RegisterUserUseCase {
    constructor(
        private userRepository: IUserRepository,
        private hashProvider: IHashProvider
    ) { }

    public async execute({ name, email, password, city, role }: IRequest): Promise<User> {
        const checkUserExists = await this.userRepository.findByEmail(email);

        if (checkUserExists) {
            throw new AppError('Email address already used.');
        }

        const hashedPassword = await this.hashProvider.generateHash(password);

        const user = await this.userRepository.create({
            name,
            email,
            password_hash: hashedPassword,
            city,
            role,
        });

        return user;
    }
}
