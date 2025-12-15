import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { AppError } from '../../shared/errors/AppError';

interface IPayload {
    sub: string;
}

export function ensureAuthenticated(
    request: Request,
    response: Response,
    next: NextFunction
): void {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
        throw new AppError('Token missing', 401);
    }

    const [, token] = authHeader.split(' ');

    try {
        const { sub: user_id } = verify(
            token,
            process.env.JWT_SECRET || 'default'
        ) as IPayload;

        // Adiciona o id do usuário no request
        request.user = {
            id: user_id,
        };

        next();
    } catch {
        throw new AppError('Invalid token', 401);
    }
}
