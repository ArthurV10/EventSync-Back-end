import { IRegistrationRepository } from '../../../domain/repositories/IRegistrationRepository';
import { AppError } from '../../../shared/errors/AppError';

interface IResponse {
    registrationId: string;
    user: {
        name: string;
        email: string;
        photo_url: string | null;
    };
    event: {
        title: string;
    };
    qr_code_data: string;
    status: string;
}

export class GetParticipantCardUseCase {
    constructor(
        private registrationRepository: IRegistrationRepository
    ) { }

    public async execute(registrationId: string, userId: string): Promise<IResponse> {
        const registration = await this.registrationRepository.findById(registrationId);

        if (!registration) {
            throw new AppError('Registration not found.', 404);
        }

        // Apenas o próprio usuário ou organizador (TODO) pode ver o cartão.
        // Por enquanto, valida se é o próprio usuário dono da inscrição.
        if (registration.user_id !== userId) {
            throw new AppError('Not authorized to view this card.', 403);
        }

        if (registration.status !== 'APPROVED' && registration.status !== 'CONFIRMED') {
            throw new AppError('Registration not approved/confirmed yet.');
        }

        // O QR code conterá apenas o ID da inscrição para ser lido pelo organizador
        // Front-end gera a imagem do QR baseada nessa string.
        const qr_code_data = registration.id;

        // Hack para typescript aceitar as relations que o repo retorna (findById traz user e event)
        const _registration = registration as any;

        return {
            registrationId: _registration.id,
            user: {
                name: _registration.user.name,
                email: _registration.user.email,
                photo_url: _registration.user.photo_url
            },
            event: {
                title: _registration.event.title
            },
            qr_code_data,
            status: _registration.status
        };
    }
}
