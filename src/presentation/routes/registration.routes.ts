import { Router } from 'express';
import { RegistrationController } from '../controllers/registrations/RegistrationController';
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated';

const registrationRoutes = Router();
const registrationController = new RegistrationController();

// Solicitar inscrição em evento
registrationRoutes.post('/events/:eventId/registrations', ensureAuthenticated, registrationController.create);

// Listar inscrições de um evento (Organizador)
registrationRoutes.get('/events/:eventId/registrations', ensureAuthenticated, registrationController.index);

// Aprovar/Recusar inscrição (id da inscrição)
registrationRoutes.patch('/registrations/:id/approve', ensureAuthenticated, registrationController.approve);
registrationRoutes.patch('/registrations/:id/reject', ensureAuthenticated, registrationController.reject);

export { registrationRoutes };
