import { Request, Response } from 'express';
import { z } from 'zod';
import { LoginUserUseCase } from '../../../application/usecases/auth/LoginUser';
import { PrismaUserRepository } from '../../../infrastructure/persistence/prisma/repositories/PrismaUserRepository';
import { BCryptHashProvider } from '../../../infrastructure/providers/BCryptHashProvider';
import { JWTTokenProvider } from '../../../infrastructure/providers/JWTTokenProvider';

export class LoginUserController {
    async handle(request: Request, response: Response): Promise<Response> {
        const loginBodySchema = z.object({
            email: z.string().email(),
            password: z.string(),
        });

        const { email, password } = loginBodySchema.parse(request.body);

        const userRepository = new PrismaUserRepository();
        const hashProvider = new BCryptHashProvider();
        const tokenProvider = new JWTTokenProvider();
        const loginUserUseCase = new LoginUserUseCase(userRepository, hashProvider, tokenProvider);

        const { user, token } = await loginUserUseCase.execute({
            email,
            password,
        });

        // Remover hash da senha
        const userResponse = { ...user, password_hash: undefined };

        return response.json({ user: userResponse, token });
    }
}
