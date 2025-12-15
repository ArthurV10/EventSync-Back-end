import { ICertificateRepository } from '../../../domain/repositories/ICertificateRepository';
import { IRegistrationRepository } from '../../../domain/repositories/IRegistrationRepository';
import { IEventRepository } from '../../../domain/repositories/IEventRepository';
import { ICheckinRepository } from '../../../domain/repositories/ICheckinRepository';
import { AppError } from '../../../shared/errors/AppError';
import { Certificate } from '@prisma/client';
import { randomUUID } from 'crypto';

export class IssueCertificateUseCase {
    constructor(
        private certificateRepository: ICertificateRepository,
        private registrationRepository: IRegistrationRepository,
        private eventRepository: IEventRepository,
        private checkinRepository: ICheckinRepository
    ) { }

    public async execute(userId: string, eventId: string): Promise<Certificate> {
        const event = await this.eventRepository.findById(eventId);
        if (!event) {
            throw new AppError('Event not found.', 404);
        }

        if (event.status !== 'FINISHED') {
            throw new AppError('Certificates are only available for finished events.');
        }

        const registration = await this.registrationRepository.findByUserAndEvent(userId, eventId);
        if (!registration) {
            throw new AppError('You are not registered for this event.', 403);
        }

        // Critério: Pelo menos 1 check-in
        const checkinCount = await this.checkinRepository.countByRegistrationId(registration.id);
        if (checkinCount < 1) {
            throw new AppError('You did not attend the event (no check-in recorded).', 403);
        }

        // Verificar se já existe
        const existingCert = await this.certificateRepository.findByUserAndEvent(userId, eventId);
        if (existingCert) {
            return existingCert;
        }

        // Gerar código de validação simples
        const validationCode = randomUUID().split('-')[0].toUpperCase();

        // Simular URL do PDF (em produção, geraria PDF e faria upload)
        const pdfUrl = `http://localhost:3000/certificates/download/${validationCode}`;

        const certificate = await this.certificateRepository.create({
            user: { connect: { id: userId } },
            event: { connect: { id: eventId } },
            validation_code: validationCode,
            pdf_url: pdfUrl
        });

        return certificate;
    }
}
