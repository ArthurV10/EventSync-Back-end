import { Router } from 'express';
import { EventController } from '../controllers/events/EventController';
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated';

const eventRoutes = Router();
const eventController = new EventController();

eventRoutes.post('/', ensureAuthenticated, eventController.create);
eventRoutes.get('/', eventController.index);
eventRoutes.get('/:id', eventController.show);
eventRoutes.get('/:id/export', ensureAuthenticated, eventController.exportRegistrations);

export { eventRoutes };
