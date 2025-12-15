import { sign } from 'jsonwebtoken';
import { ITokenProvider } from '../../application/providers/ITokenProvider';

export class JWTTokenProvider implements ITokenProvider {
    public generateToken(userId: string): string {
        const secret = process.env.JWT_SECRET || 'default';
        const token = sign({}, secret, {
            subject: userId,
            expiresIn: '1d',
        });
        return token;
    }
}
