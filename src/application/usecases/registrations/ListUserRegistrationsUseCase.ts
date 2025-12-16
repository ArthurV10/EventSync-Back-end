import { IRegistrationRepository } from '../../../domain/repositories/IRegistrationRepository';
import { Registration } from '@prisma/client';

export class ListUserRegistrationsUseCase {
    constructor(private registrationRepository: IRegistrationRepository) { }

    public async execute(userId: string): Promise<Registration[]> {
        const registrations = await this.registrationRepository.findByUserId(userId);
        return registrations;
    }
}
