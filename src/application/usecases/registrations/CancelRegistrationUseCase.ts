import { IRegistrationRepository } from '../../../domain/repositories/IRegistrationRepository';
import { AppError } from '../../../shared/errors/AppError';

interface IRequest {
    id: string;
    userId: string;
}

export class CancelRegistrationUseCase {
    constructor(private registrationRepository: IRegistrationRepository) { }

    public async execute({ id, userId }: IRequest): Promise<void> {
        const registration = await this.registrationRepository.findById(id);

        if (!registration) {
            throw new AppError('Registration not found.', 404);
        }

        // Allow user to cancel their own registration
        if (registration.user_id !== userId) {
            throw new AppError('You can only cancel your own registrations.', 403);
        }

        await this.registrationRepository.delete(id);
    }
}
