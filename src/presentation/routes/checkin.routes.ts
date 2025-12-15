import { Router } from 'express';
import { CheckinController } from '../controllers/checkin/CheckinController';
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated';

const checkinRoutes = Router();
const checkinController = new CheckinController();

// Participante pega seu cartão
checkinRoutes.get('/registrations/:registrationId/card', ensureAuthenticated, checkinController.getCard);

// Organizador faz check-in (POST /events/:eventId/checkin ? ou /checkin direto).
// Spec sugere Organizador usa painel de check-in.
checkinRoutes.post('/checkin', ensureAuthenticated, checkinController.create);

export { checkinRoutes };
