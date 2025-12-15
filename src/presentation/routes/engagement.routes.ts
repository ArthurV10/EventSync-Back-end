import { Router } from 'express';
import { EngagementController } from '../controllers/engagement/EngagementController';
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated';

const engagementRoutes = Router();
const engagementController = new EngagementController();

// Avaliar evento
engagementRoutes.post('/events/:eventId/reviews', ensureAuthenticated, engagementController.createReview);

// Emitir certificado
engagementRoutes.post('/events/:eventId/certificates', ensureAuthenticated, engagementController.issueCertificate);

// (Opcional) Listar avaliações ou certificados? Fica para refinamento se sobrar tempo.

export { engagementRoutes };
