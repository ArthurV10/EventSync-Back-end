import { IFriendshipRepository } from '../../../domain/repositories/IFriendshipRepository';
import { IRegistrationRepository } from '../../../domain/repositories/IRegistrationRepository';
import { IEventRepository } from '../../../domain/repositories/IEventRepository';
import { AppError } from '../../../shared/errors/AppError';
import { Friendship } from '@prisma/client';

export class RequestFriendshipUseCase {
    constructor(
        private friendshipRepository: IFriendshipRepository,
        private registrationRepository: IRegistrationRepository,
        private eventRepository: IEventRepository
    ) { }

    public async execute(requesterId: string, addresseeId: string, eventId: string): Promise<Friendship> {
        if (requesterId === addresseeId) {
            throw new AppError('Cannot send friendship request to yourself.');
        }

        const event = await this.eventRepository.findById(eventId);
        if (!event) {
            throw new AppError('Event not found.', 404);
        }

        // Regra: Ambos devem estar inscritos e confirmados/aprovados no mesmo evento.
        const requesterRegistration = await this.registrationRepository.findByUserAndEvent(requesterId, eventId);
        const addresseeRegistration = await this.registrationRepository.findByUserAndEvent(addresseeId, eventId);

        const validStatus = ['APPROVED', 'CONFIRMED']; // Status válidos

        if (!requesterRegistration || !validStatus.includes(requesterRegistration.status)) {
            throw new AppError('You must be a confirmed participant of the event to request friendship.', 403);
        }

        if (!addresseeRegistration || !validStatus.includes(addresseeRegistration.status)) {
            throw new AppError('Addressee is not a confirmed participant of this event.', 403);
        }

        // Verifica amizade existente ou pendente
        const existingFriendship = await this.friendshipRepository.findByUsers(requesterId, addresseeId);

        if (existingFriendship) {
            if (existingFriendship.status === 'ACCEPTED') {
                throw new AppError('Users are already friends.');
            }
            if (existingFriendship.status === 'PENDING') {
                throw new AppError('Friendship request already pending.');
            }
            // Se REJECTED, pode permitir nova tentativa? Regra não especifica. Vamos permitir (create new or update old). 
            // Mas por simplificação, se rejeitado recentemente, talvez bloquear. 
            // Vamos bloquear se foi rejeitado? A spec não diz. Vamos apenas lançar erro genérico ou permitir.
            // Vou assumir que se existe registro, retorna ele ou erro.
            throw new AppError('Friendship status is ' + existingFriendship.status);
        }

        const friendship = await this.friendshipRepository.create({
            requester: { connect: { id: requesterId } },
            addressee: { connect: { id: addresseeId } },
            status: 'PENDING'
        });

        return friendship;
    }
}
