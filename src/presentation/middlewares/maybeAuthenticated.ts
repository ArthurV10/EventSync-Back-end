import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

interface IPayload {
    sub: string;
}

export function maybeAuthenticated(
    request: Request,
    response: Response,
    next: NextFunction
): void {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
        return next();
    }

    const [, token] = authHeader.split(' ');

    try {
        const { sub: user_id } = verify(
            token,
            process.env.JWT_SECRET || 'default'
        ) as IPayload;

        (request as any).user = {
            id: user_id,
        };

        return next();
    } catch {
        // If token is invalid, we proceed as unauthenticated
        return next();
    }
}
