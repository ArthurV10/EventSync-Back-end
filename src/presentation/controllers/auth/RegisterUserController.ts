import { Request, Response } from 'express';
import { z } from 'zod';
import { RegisterUserUseCase } from '../../../application/usecases/auth/RegisterUser';
import { PrismaUserRepository } from '../../../infrastructure/persistence/prisma/repositories/PrismaUserRepository';
import { BCryptHashProvider } from '../../../infrastructure/providers/BCryptHashProvider';

export class RegisterUserController {
    async handle(request: Request, response: Response): Promise<Response> {
        const registerBodySchema = z.object({
            name: z.string(),
            email: z.string().email(),
            password: z.string().min(6),
            city: z.string().optional(),
            role: z.enum(['USER', 'ORGANIZER']).optional(),
        });

        const { name, email, password, city, role } = registerBodySchema.parse(request.body);

        const userRepository = new PrismaUserRepository();
        const hashProvider = new BCryptHashProvider();
        const registerUserUseCase = new RegisterUserUseCase(userRepository, hashProvider);

        const user = await registerUserUseCase.execute({
            name,
            email,
            password,
            city,
            role,
        });

        // Remover hash da senha do retorno (idealmente usar mapper)
        const userResponse = { ...user, password_hash: undefined };

        return response.status(201).json(userResponse);
    }
}
