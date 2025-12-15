import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IHashProvider } from '../../providers/IHashProvider';
import { ITokenProvider } from '../../providers/ITokenProvider';
import { AppError } from '../../../shared/errors/AppError';
import { User } from '@prisma/client';

interface IRequest {
    email: string;
    password: string;
}

interface IResponse {
    user: User;
    token: string;
}

export class LoginUserUseCase {
    constructor(
        private userRepository: IUserRepository,
        private hashProvider: IHashProvider,
        private tokenProvider: ITokenProvider
    ) { }

    public async execute({ email, password }: IRequest): Promise<IResponse> {
        const user = await this.userRepository.findByEmail(email);

        if (!user) {
            throw new AppError('Incorrect email/password combination.', 401);
        }

        const passwordMatched = await this.hashProvider.compareHash(password, user.password_hash);

        if (!passwordMatched) {
            throw new AppError('Incorrect email/password combination.', 401);
        }

        const token = this.tokenProvider.generateToken(user.id);

        return {
            user,
            token,
        };
    }
}
