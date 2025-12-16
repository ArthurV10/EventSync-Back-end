import { Router } from 'express';
import { EventController } from '../controllers/events/EventController';
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated';
import { maybeAuthenticated } from '../middlewares/maybeAuthenticated';

const eventRoutes = Router();
const eventController = new EventController();

eventRoutes.post('/', ensureAuthenticated, eventController.create);
eventRoutes.get('/', eventController.index);
eventRoutes.get('/organizer', ensureAuthenticated, eventController.listByOrganizer); // Nova rota "Meus Eventos"
eventRoutes.get('/:id', maybeAuthenticated, eventController.show);
eventRoutes.put('/:id', ensureAuthenticated, eventController.update);
eventRoutes.delete('/:id', ensureAuthenticated, eventController.delete);
eventRoutes.get('/:id/export', ensureAuthenticated, eventController.exportRegistrations);

export { eventRoutes };
